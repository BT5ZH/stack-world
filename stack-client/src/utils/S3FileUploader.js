import AWS from "aws-sdk";
import axios from "@/utils/axios";
import random from "@/utils/utils";

const DEFAULT_REGION = "cn-northwest-1";

const DEFAULT_PARAMS = {
  ACL: "public-read",
  Bucket: "stack-world",
};

const DEFAULT_CONFIG = {
  accessErrCallback: function (error) {
    console.error("update S3 credential failed！");
    console.error(error);
  },
  progressCallback: function () {},
  failCallback: function (error) {
    console.error("error happened when file is uploading, reason is:");
    console.error(error);
    !error && console.error("file upload ended, but no Etag returned.");
  },
};

/**
 * 解析文件后缀
 *
 * @param {Array<File> | File} files 文件列表
 * @returns {Array<String> | String}  文件后缀
 */
function getFileContentType(files) {
  const regExp = /[^.]\w*$/;
  const callback = (file) => file.name.match(regExp)[0];
  if (files instanceof File) {
    return callback(files);
  }
  if (Array.isArray(files)) {
    return files.map(callback);
  }
  console.error("params type must be file or fileList");
}

/**
 * 获取视频的时长
 *
 * @param {File} file 视频文件
 * @return {Promise} 视频时长
 */
function getVideoDuration(file) {
  let videoEle = document.createElement("video");
  videoEle.src = URL.createObjectURL(file);
  return new Promise((resolve) => {
    videoEle.onloadedmetadata = function () {
      resolve(videoEle.duration);
    };
  });
}

/**
 * 更新 S3 上传凭证
 *
 * @param {File} file 要上传的文件
 * @param {Object} config 传入的 config 配置
 */
async function updateAccessConfig(file, config) {
  try {
    const key = getFileContentType(file);
    const fileID = random(8, 16);
    DEFAULT_PARAMS.Key = fileID;

    config.body.url = `${config.filePath}${fileID}.${key}`;
    config.body.rsType = key;
    config.body.size = file.size;
    config.body.originName = file.name;
    config.body.duration = key === "mp4" ? await getVideoDuration(file) : 0;

    const { data } = await axios.post(config.apiUrl, config.body);
    if (data.credentials) {
      const { AccessKeyId, SecretAccessKey, SessionToken } = data.credentials;
      AWS.config = new AWS.Config({
        accessKeyId: AccessKeyId,
        secretAccessKey: SecretAccessKey,
        sessionToken: SessionToken,
        region: DEFAULT_REGION,
      });
      return new AWS.S3();
    }
    throw "credentials syntax error";
  } catch (error) {
    config.accessErrCallback(error);
  }
}

/**
 * 更新文件上传参数
 *
 * @param {File} file 要上传的文件
 * @param {String} filePath 文件在存储桶中的位置
 * @param {Object} that vue 的 this 指针
 * @returns {Object} S3 sdk 上传参数
 */
function updateUploadParams(file, filePath, that, params) {
  const key = getFileContentType(file);
  const uploaderId = that.$store.state.public.uid || "administrator";
  const { Metadata = {} } = params;
  return {
    ...DEFAULT_PARAMS,
    ...params,
    Body: file,
    Key: `${filePath}${DEFAULT_PARAMS.Key}.${key}`,
    ContentType: file.type || key,
    Metadata: { uploader: uploaderId || "default", ...Metadata },
  };
}

/**
 * 上传文件到 S3
 *
 * @param {Array<File> | File} files 要上传的文件或文件列表 <必需>
 * @param {Object} config 属性如下：
 * - that 传值 this 即可，用于获取 vuex public下的 uid <必需>
 * - apiUrl 可能不同角色有不同 API，用于获取 S3 凭证 <必需>
 * - filePath 该文件在存储桶中的存储位置 <必需>
 * - body 要插入数据库的字段 <必需>
 * - successCallback 文件上传成功的回调函数 <必需>
 * - accessErrCallback 获取 S3 凭证失败时的回调函数，默认会在控制台打出错误
 * - progressCallback 上传进度更新回调函数，一般用于上传进度展示，无默认行为
 * - failCallback 文件上传失败回调函数，上传过程中出错、上传结束后未收到
 *   S3 SDK 返回的 data 中的 Etag均视为上传失败，默认会在控制台打出错误
 * @param {Object} params 属性如下：
 * - ACL 默认值 public-read，文件公有，获取链接者可读取文件
 * - Bucket 默认值 stack_world，存储桶的名称
 * - Metadata 默认值只有 uploader, 即当前用户的 ID
 */
async function uploadFile([file], config = {}, params = {}) {
  getVideoDuration(file);
  config = { ...DEFAULT_CONFIG, ...config };
  const S3Instance = await updateAccessConfig(file, config);
  params = updateUploadParams(file, config.filePath, config.that, params);
  if (!S3Instance) return;
  const request = S3Instance.putObject(params, (err, data) => {
    if (err || data.Etag) {
      config.failCallback(err);
      return;
    }
    config.successCallback();
    console.info("file upload successfully!");
  });
  config.progressCallback &&
    request.on("httpUploadProgress", (response) => {
      const percent = ((response.loaded * 100) / response.total).toFixed(0);
      config.progressCallback(percent);
    });
}

export default uploadFile;

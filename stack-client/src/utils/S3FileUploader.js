import AWS from "aws-sdk";
import axios from "@/utils/axios";

const DEFAULT_REGION = "cn-northwest-1";

const DEFAULT_PARAMS = {
  ACL: "public-read",
  Bucket: "stack-world",
};

const DEFAULT_CONFIG = {
  apiUrl: "pc/v1/resources/upload",
  accessErrCallback: function(error) {
    console.error("update S3 credential failed！");
    console.error(error);
  },
  progressCallback: function() {},
  failCallback: function(error) {
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
 * 更新 S3 上传凭证
 *
 * @param {String} apiUrl 文件上传地址
 * @param {Object} body 要插入数据库的字段
 * @param {Function} callback 凭证更新失败回调
 */
async function updateAccessConfig(apiUrl, body, callback) {
  try {
    const { data } = await axios.post(apiUrl, body);
    if (data.credentials && data.fileID) {
      const { AccessKeyId, SecretAccessKey, SessionToken } = data.credentials;
      AWS.config = new AWS.Config({
        accessKeyId: AccessKeyId,
        secretAccessKey: SecretAccessKey,
        sessionToken: SessionToken,
        region: DEFAULT_REGION,
      });
      DEFAULT_PARAMS.Key = data.fileID;
    }
    return new AWS.S3();
  } catch (error) {
    callback(error);
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
  delete params.Metadata;
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
 * - filePath 该文件在存储桶中的存储位置 格式为：/{location}/ (两端都加斜杠)<必需>
 * - body 要插入数据库的字段 <必需>
 * - successCallback 文件上传成功的回调函数 <必需>
 * - apiUrl 可能不同角色有不同 API，用于获取 S3 凭证
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
  config = { ...DEFAULT_CONFIG, ...config };
  const S3Instance = await updateAccessConfig(config.apiUrl, config.accessErrCallback);
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
  // TODO 进度回调函数暂时无效，在解决中，不影响接口。
  config.progressCallback &&
    request.on("httpUploadProgress", config.progressCallback);
}

export default uploadFile;

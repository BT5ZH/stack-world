import { idCreator } from "@/utils/utils";
import axios from "@/utils/axios";

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
    videoEle.onloadedmetadata = function() {
      resolve(videoEle.duration);
    };
  });
}

async function uploadFile([file], config = {}) {
  let { body, failCallback, successCallback } = config;
  const formData = new FormData();
  const fileID = idCreator(8, 16);
  const key = getFileContentType(file);
  body = {
    ...body,
    fileID: fileID,
    filePath: config.filePath,
    url: `${config.filePath}${fileID}.${key}`,
    rsType: key,
    size: file.size,
    originName: file.name,
    duration: key === "mp4" ? await getVideoDuration(file) : 0,
    file: file,
  };
  for (let item in body) {
    formData.append(item, body[item]);
  }
  try {
    const { data } = await axios.post(config.apiUrl, formData);
    if (successCallback) {
      successCallback(data);
    } else {
      console.log(data);
    }
  } catch (error) {
    if (failCallback) {
      failCallback(error);
    } else {
      console.error(error);
    }
  }
}

export default uploadFile;

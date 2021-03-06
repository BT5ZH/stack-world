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
    videoEle.onloadedmetadata = function () {
      resolve(videoEle.duration);
    };
  });
}

async function uploadFile([file], config = {}) {
  let { body, failCallback, successCallback } = config;
  const fileID = idCreator(8, 16);
  const key = getFileContentType(file);
  body = {
    ...body,
    url: `${config.filePath}${fileID}.${key}`,
    rsType: key,
    size: file.size,
    originName: file.name,
    duration: key === "mp4" ? await getVideoDuration(file) : 0,
  };
  try {
    const idResult = await axios.post(config.apiUrl, body);
    if (idResult.data.status !== "success") {
      throw "get fileId from server faild!";
    }
    let formData = new FormData();
    formData.append("fileID", fileID);
    formData.append("filePath", config.filePath);
    formData.append("rsType", key);
    formData.append("file", file);
    // TODO 修改为动态URL 此处有问题
    const apiUrl = "http://10.8.51.45:3000/upload";
    const uploadResult = await axios.post(apiUrl, formData);

    console.log(uploadResult);

    if (uploadResult.data === "success" && successCallback) {
      successCallback(uploadResult.data);
    } else {
      throw "upload file faild!";
    }
  } catch (error) {
    console.log("come err");
    if (failCallback) {
      failCallback(error);
    } else {
      console.error(error);
    }
  }
}

export default uploadFile;

/**
 * 2021.3.13 Henrenx
 *
 * 功能：转储录播视频
 */
const fs = require("fs");
const path = require("path");
const request = require("request");

function dumpFile(url, orgId, fileId) {
  const folderPath = `${orgId}/teacher`;
  const tmpPath = path.resolve("../", process.cwd(), "public", folderPath);
  const filePath = `${tmpPath}/${fileId}.mp4`;
  mkdirsSync(tmpPath);
  const ws = fs.createWriteStream(filePath, { autoClose: true });
  return new Promise((resolve, reject) => {
    request(url).pipe(ws);
    ws.on("finish", () => {
      resolve("ok");
    });
    ws.on("error", (err) => {
      reject("fail");
    });
  });
}

function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

module.exports = dumpFile;

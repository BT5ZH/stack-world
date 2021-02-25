const fs = require("fs");
const path = require("path");

// multer 文档地址
// https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { filePath } = req.body;
    if (!filePath) {
      cb(new Error("invalid filePath"));
      console.error("filePath is not found");
      return null;
    }
    let tmpPath = path.resolve("../", process.cwd(), "public", filePath);
    mkdirsSync(tmpPath);
    delete req.body.filePath;
    cb(null, tmpPath);
  },
  filename: function (req, file, cb) {
    const { fileID, rsType } = req.body;
    if (fileID && rsType) {
      cb(null, `${fileID}.${rsType}`);
      delete req.body.fileID;
      return null;
    }
    cb(new Error("invalid fileID or rsType"));
    console.error("fileID or rsType is not found");
  },
});

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

const upload = multer({ storage: storage });

module.exports = upload;

const express = require("express");
const router = express.Router();
const upload = require("../controller/fileStorage");

/* GET home page. */
router.post("/upload", upload.single("file"), function (req, res, next) {
  // TODO 存储 req.body 内容到数据库
  console.log(req.body);
  res.send("success");
});

module.exports = router;

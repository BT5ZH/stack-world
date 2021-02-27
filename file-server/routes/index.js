const express = require("express");
const router = express.Router();
const upload = require("../controller/fileStorage");

/* GET home page. */
router.post("/upload", upload.single("file"), function (req, res, next) {
  res.send("success");
});

module.exports = router;

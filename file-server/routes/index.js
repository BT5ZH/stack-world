const express = require("express");
const router = express.Router();
const upload = require("../controller/fileStorage");

router.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json");
  next();
});

router.post("/upload", upload.single("file"), function (req, res, next) {
  res.send("success");
});

module.exports = router;

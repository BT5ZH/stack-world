const express = require("express");
const router = express.Router();
const upload = require("../controller/fileStorage");
const dumpFile = require("../controller/dumpFile");

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

router.post("/dumpFile", async function (req, res, next) {
  const { url, orgId, fileId } = req.body;
  if (url && orgId && fileId) {
    try {
      await dumpFile(url, orgId, fileId);
      res.send({ status: "success" });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send({ status: "fail", msg: "invalid file url or orgId or fileId" });
  }
});

module.exports = router;

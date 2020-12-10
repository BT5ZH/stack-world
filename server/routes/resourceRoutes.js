const express = require("express");

const resourceController = require("../controller/resourceController");

const router = express.Router();
router.route("/upload").post(resourceController.uploadResource);

module.exports = router;

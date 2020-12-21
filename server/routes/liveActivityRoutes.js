const express = require("express");
const liveActivityController = require("../controller/liveActivityController");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .post(authController.protect, liveActivityController.createActivity);

module.exports = router;

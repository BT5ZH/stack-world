const express = require("express");
const liveActivityController = require("../controller/liveActivityController");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  //   .get(authController.protect, liveActivityController.getAllDevices)
  .post(authController.protect, liveActivityController.createActivity);
// router
//   .route("/:id")
//   .get(authController.protect, liveActivityController.getDevice)
//   .patch(authController.protect, liveActivityController.updateDevice)
//   .delete(authController.protect, liveActivityController.deleteDevice);

module.exports = router;

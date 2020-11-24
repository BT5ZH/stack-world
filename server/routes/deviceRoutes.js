const express = require("express");
const deviceController = require("../controller/deviceController");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, deviceController.getAllDevices)
  .post(authController.protect, deviceController.createDevice);
router
  .route("/:id")
  .get(authController.protect, deviceController.getDevice)
  .patch(authController.protect, deviceController.updateDevice)
  .delete(authController.protect, deviceController.deleteDevice);

module.exports = router;

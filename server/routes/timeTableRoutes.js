const express = require("express");
const timeTableController = require("../controller/timeTableController");
const authController = require("../controller/authController");

const router = express.Router();

// 增查
router
  .route("/")
  .get(authController.protect, timeTableController.getAllTimeTable)
  .post(authController.protect, timeTableController.createTimeTable);

// 改删
router
  .route("/:id")
  .patch(authController.protect, timeTableController.updateTimeTable)
  .delete(authController.protect, timeTableController.deleteTimeTable);

module.exports = router;

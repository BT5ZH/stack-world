const express = require("express");
const timeTableController = require("../controller/timeTableController");
const authController = require("../controller/authController");

const router = express.Router();

// 增查
router
  .route("/")
  .get(authController.protect, timeTableController.getAllTimeTable) // get course table
  .post(authController.protect, timeTableController.createTimeTable);

// 改删
router
  .route("/:id")
  .patch(authController.protect, timeTableController.updateTimeTable)
  .delete(authController.protect, timeTableController.deleteTimeTable);

router
  .route("/getTeacherTimeTable")
  .post(authController.protect, timeTableController.getTeacherTables); // get teacher table

router
  .route("/getCourseTimeTable")
  .post(authController.protect, timeTableController.getCourseTables);

module.exports = router;

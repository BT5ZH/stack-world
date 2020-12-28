const express = require("express");
const timeTableController = require("../controller/timeTableController");
const authController = require("../controller/authController");

const router = express.Router();

// 增查
router
  .route("/")
  .get(authController.protect, timeTableController.getAllTimeTable)
  .post(authController.protect, timeTableController.createTimeTable);

router
  .route("/getTimeTableFromTeacherID")
  .post(authController.protect, timeTableController.getTimeTableFromTeacherID); 

router
  .route("/getTimeTableFromCourseID")
  .post(authController.protect, timeTableController.getTimeTableFromCourseID); 

router
  .route("/getTimeTableFromRoomID")
  .get(authController.protect, timeTableController.getTimeTableFromRoomID); 

router
  .route("/getTimeTableFromStudentID")
  // .post(authController.protect, timeTableController.getTimeTableFromStudentID); 
  .post(timeTableController.getTimeTableFromStudentID); 

  

// 改删
router
  .route("/:id")
  .patch(authController.protect, timeTableController.updateTimeTable)
  .delete(authController.protect, timeTableController.deleteTimeTable);
  
module.exports = router;

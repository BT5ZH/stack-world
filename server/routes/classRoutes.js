const express = require("express");
const classController = require("../controller/classController");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, classController.getAllClasses)
  .post(authController.protect, classController.createClass);
router
  .route("/:id")
  .get(authController.protect, classController.getClass)
  .patch(authController.protect, classController.updateClass)
  .delete(authController.protect, classController.deleteClass);
router
  .route("/:id/students")
  .get(authController.protect, classController.getStudents)
  .patch(authController.protect, classController.updateStudents)
  .post(authController.protect, classController.addStudents)
  .delete(authController.protect, classController.deleteStudents);
router
  .route("/:id/curriculum")
  .get(authController.protect, classController.getCurriculum)
  //   .patch(authController.protect, classController.updateStudent)
  .post(authController.protect, classController.addCurriculum)
  .delete(
    authController.protect,
    classController.deleteMultipleCourseTimeTable
  );

module.exports = router;

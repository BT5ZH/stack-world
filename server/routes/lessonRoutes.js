const express = require("express");
const lessonController = require("../controller/lessonController");
const router = express.Router({ mergeParams: true });
const authController = require("../controller/authController");

router
  .route("/")
  .get(authController.protect,lessonController.getAllLessons)
  .post(authController.protect,lessonController.createLesson);

router
  .route("/:lesson_id")
  .get(authController.protect,lessonController.getLesson)
  .patch(authController.protect,lessonController.updateLesson)
  .delete(authController.protect,lessonController.deleteLesson);
router
  .route("/getLessonsByTeacherID")
  .post(authController.protect,lessonController.getLessonsByTeacherID)
router
  .route("/getLessonsByCourseID")
  .post(authController.protect,lessonController.getLessonsByCourseID)
router
  .route("/getLessonsByClassID")
  .post(authController.protect,lessonController.getLessonsByClassID)
router
  .route("/getLessonByCourseIDandTeacherID")
  .post(authController.protect,lessonController.getLessonByCourseIDandTeacherID)
router
  .route("/getLessonByCourseIDandClassID")
  .post(authController.protect,lessonController.getLessonByCourseIDandClassID)
router
  .route("/getLessonByTeacherIDandClassID")
  .post(authController.protect,lessonController.getLessonByTeacherIDandClassID)

module.exports = router;
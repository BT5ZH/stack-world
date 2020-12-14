const express = require("express");
const lessonController = require("../controller/lessonController");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(lessonController.getAllLessons)
  .post(lessonController.createLesson);

router
  .route("/:lesson_id")
  .get(lessonController.getLesson)
  .patch(lessonController.updateLesson)
  .delete(lessonController.deleteLesson);
router
  .route("/getLessonsByTeacherID")
  .post(lessonController.getLessonsByTeacherID)
router
  .route("/getLessonsByCourseID")
  .post(lessonController.getLessonsByCourseID)
router
  .route("/getLessonsByClassID")
  .post(lessonController.getLessonsByClassID)
router
  .route("/getLessonByCourseIDandTeacherID")
  .post(lessonController.getLessonByCourseIDandTeacherID)
router
  .route("/getLessonByCourseIDandClassID")
  .post(lessonController.getLessonByCourseIDandClassID)
router
  .route("/getLessonByTeacherIDandClassID")
  .post(lessonController.getLessonByTeacherIDandClassID)

module.exports = router;
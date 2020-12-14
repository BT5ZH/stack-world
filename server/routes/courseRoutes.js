const express = require("express");
const courseController = require("../controller/courseController");

const router = express.Router();

router
  .route("/")
  .get(courseController.getAllCourses)
  .post(courseController.createCourse);

router
  .route("/batchOptCourses")
  .delete(courseController.batchDeleteCourses)
  .post(courseController.batchAddCourses);
router
  .route("/:_id")
  .get(courseController.getCourse)
  .delete(courseController.deleteOneCourse)
  .post(courseController.updateCourse);

module.exports = router;

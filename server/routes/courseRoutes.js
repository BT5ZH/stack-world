const express = require("express");
const courseController = require("../controller/courseController");
const authController = require("../controller/authController");
const router = express.Router({ mergeParams: true });


router
  .route("/")
  .get(authController.protect,courseController.getAllCourses)
  .post(authController.protect,courseController.createCourse);

router
  .route("/batchOptCourses")
  .delete(authController.protect,courseController.batchDeleteCourses)
  .post(authController.protect,courseController.batchAddCourses);
router
  .route("/:_id")
  .get(authController.protect,courseController.getCourse)
  .delete(authController.protect,courseController.deleteOneCourse)
  .post(authController.protect,courseController.updateCourse);

module.exports = router;

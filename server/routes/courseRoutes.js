const express = require("express");
const courseController = require("../controller/courseController");
const authController = require("../controller/authController");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(authController.protect, courseController.getAllCourses)
  .post(authController.protect, courseController.createCourse);

router
  .route("/batchOptCourses")
<<<<<<< HEAD
  .delete(authController.protect,courseController.batchDeleteCourses)
  .post(authController.protect,courseController.batchAddCourses);

router
  .route("/getSubOrgMajor")
  .get(authController.protect,courseController.putSubOrgAndMajorIntoTree)

router
  .route("/:_id")
  .get(authController.protect,courseController.getCourse)
  .delete(authController.protect,courseController.deleteOneCourse)
  .post(authController.protect,courseController.updateCourse);  
=======
  .delete(authController.protect, courseController.batchDeleteCourses)
  .post(authController.protect, courseController.batchAddCourses);

router
  .route("/courseTree")
  .get(authController.protect, courseController.putSubOrgAndMajorIntoTree);

router
  .route("/:_id")
  .get(authController.protect, courseController.getCourse)
  .delete(authController.protect, courseController.deleteOneCourse)
  .post(authController.protect, courseController.updateCourse);

>>>>>>> 6ea9dcd0a388f83e75fc2c690fdee3303666fc2b
module.exports = router;

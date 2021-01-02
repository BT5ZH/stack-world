const express = require("express");

const resourceController = require("../controller/resourceController");
const authController = require("../controller/authController");

const router = express.Router();
router
  .route("/upload")
  .post(authController.protect, resourceController.uploadResource);

router
  .route("/collect")
  .post(authController.protect, resourceController.collectResource);
router
  .route("/deleteCollect")
  .post(authController.protect, resourceController.deleteCollectResource);

router
  .route("/getLessonResourceOfTeacher")
  .post(authController.protect, resourceController.getLessonResourceOfTeacher);

// // 测试
router
  .route("/")
  .get(authController.protect, resourceController.getAllResources);

// router
//   .route("/test1")
//   .get(courseController.getcourse)
//   .post(courseController.update_course);

// router
//   .route("/test2")
//   .get(courseController.get_all)
//   .post(courseController.create_course);

module.exports = router;

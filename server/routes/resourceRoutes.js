const express = require("express");

const resourceController = require("../controller/resourceController");

const router = express.Router();
router.route("/upload").post(resourceController.uploadResource);

// 测试
router.route("/del").post(courseController.del_course);

router
  .route("/test1")
  .get(courseController.getcourse)
  .post(courseController.update_course);

router
  .route("/test2")
  .get(courseController.get_all)
  .post(courseController.create_course);

module.exports = router;

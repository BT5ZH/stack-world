const express = require("express");
const resourceController = require("../controller/resourceController");
const courseController = require("../controller/coursecontroller");

const router = express.Router();

router.patch(
  "/upload",
  resourceController.uploadResourceFile,
  resourceController.uploadResource
);
router
  .route("/")
  .get(resourceController.getAllResources)
  .post(resourceController.createResource);

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

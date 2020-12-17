const express = require("express");
const prepareLessonController = require("../controller/prepareLessonController");
const authController = require("../controller/authController");
const router = express.Router({ mergeParams: true });

// router
// .route('/createOnePrepareLesson')
// .post(prepareLessonController.createOnePrepareLesson);
router
  .route("/")
  .get(authController.protect, prepareLessonController.getAllPrepareLessons) // 获取某组织所有校区及建筑信息
  //.post(authController.protect, prepareLessonController.createCampus); // 新建校区信息

router
  .route("/deleteOnePrepareLesson")
  .delete(authController.protect,prepareLessonController.deleteOnePrepareLesson
);

router
  .route("/getOnePrepareLesson")
  .post(authController.protect, prepareLessonController.getOnePrepareLesson);

router
  .route("/addNewSection")
  .post(authController.protect, prepareLessonController.addNewSection);

router
  .route("/deleteSection")
  .post(authController.protect, prepareLessonController.deleteSection);

router
  .route("/updateSectionName")
  .post(authController.protect, prepareLessonController.updateSectionName);

router.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json");
  next();
});

module.exports = router;

const express = require("express");
const prepareLessonController = require("../controller/prepareLessonController");
const authController = require("../controller/authController");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(authController.protect, prepareLessonController.getAllPrepareLessons);

router
  .route("/deleteOnePrepareLesson")
  .delete(
    authController.protect,
    prepareLessonController.deleteOnePrepareLesson
  );

router
  .route("/getOnePrepareLesson")
  .post(authController.protect, prepareLessonController.getOnePrepareLesson);

router
  .route("/updateOnePrepareLesson")
  .post(authController.protect, prepareLessonController.updateOnePrepareLesson);

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

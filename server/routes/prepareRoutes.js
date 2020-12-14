const express = require("express");
const prepareLessonController = require("../controller/prepareLessonController");

const router = express.Router({ mergeParams: true });

// router
// .route('/createOnePrepareLesson')
// .post(prepareLessonController.createOnePrepareLesson);

router
  .route("/deleteOnePrepareLesson")
  .delete(prepareLessonController.deleteOnePrepareLesson);
  
router
  .route("/getOnePrepareLesson")
  .post(prepareLessonController.getOnePrepareLesson);

router.route("/addNewSection").post(prepareLessonController.addNewSection);

router.route("/deleteSection").post(prepareLessonController.deleteSection);

router
  .route("/updateSectionName")
  .post(prepareLessonController.updateSectionName);

router.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json");
  next();
});

module.exports = router;

const express = require("express");
const homeworkController = require("../controller/homeworkController");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, homeworkController.getAllSetHomework)
  .post(authController.protect, homeworkController.createSetHomework);

router
  .route("/getSetHomeworkByLessonID")
  .post(authController.protect, homeworkController.getSetHomeworksByLessonID);
router
  .route("/getSetAndSubmitHomeworkForStuByLessonID")
  .post(
    authController.protect,
    homeworkController.getSetAndSubmitHomeworkForStuByLessonID
  );

router
  .route("/getSetAndSubmitHomeworkForStuByHomewrokID")
  .post(
    authController.protect,
    homeworkController.getSetAndSubmitHomeworkForStuByHomewrokID
  );

router
  .route("/getSetHomeworkByLessonIDandNumber")
  .post(
    authController.protect,
    homeworkController.getSetHomeworkByLessonIDandNumber
  );

router
  .route("/:id")
  .get(authController.protect, homeworkController.getSetHomeworkByID)
  .patch(authController.protect, homeworkController.updateSetHomework)
  .delete(authController.protect, homeworkController.deleteSetHomework);

module.exports = router;

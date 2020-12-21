const express = require("express");
const setHomeworkController = require("../controller/setHomeworkController");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, setHomeworkController.getAllSetHomework)
  .post(authController.protect, setHomeworkController.createSetHomework);

router
  .route("/getSetHomeworkByLessonID")
  .post(authController.protect, setHomeworkController.getSetHomeworksByLessonID);

router
  .route("/getSetHomeworkByLessonIDandNumber")
  .post(authController.protect, setHomeworkController.getSetHomeworkByLessonIDandNumber);

router
  .route("/:id")
  .get(authController.protect, setHomeworkController.getSetHomeworkByID)
  .patch(authController.protect, setHomeworkController.updateSetHomework)
  .delete(authController.protect, setHomeworkController.deleteSetHomework);

module.exports = router;

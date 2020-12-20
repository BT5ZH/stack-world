const express = require("express");
const submitHomeworkController = require("../controller/submitHomeworkController");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, submitHomeworkController.getAllSubmitHomework)
  .post(authController.protect, submitHomeworkController.createSubmitHomewrok);

router
  .route("/getSubmitHomeworkByIDandStudentID")
  .post(authController.protect, submitHomeworkController.getSubmitHomeworkByIDandStudentID);

router
  .route("/:id")
  .get(authController.protect, submitHomeworkController.getSubmitHomework)
  .patch(authController.protect, submitHomeworkController.updateSubmitHomework)
  .delete(
    authController.protect,
    submitHomeworkController.deleteSubmitHomework
  );

module.exports = router;

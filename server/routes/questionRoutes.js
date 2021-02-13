const express = require("express");
const questionController = require("../controller/questionController");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, questionController.getAllQuestions) 
  .post(authController.protect, questionController.createQuestion); 
router
  .route("/multipleQuestions")
  .post(authController.protect,questionController.createMultipleQuestions);
// router
//   .route("/:id")
//   .get(authController.protect, questionController.getQuestion) 
//   .patch(authController.protect, questionController.updateQuestion) 
//   .delete(authController.protect, questionController.deleteQuestion); 

module.exports = router;

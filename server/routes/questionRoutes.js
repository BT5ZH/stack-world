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
router
  .route("/paper")
  .post(authController.protect, questionController.createPaper); 
router
  .route("/paper/getPapersByLessonID")
  .post(authController.protect, questionController.getPapersByLessonID) ;

router
  .route("/paper/getquestionBankByPaperID")
  .post(authController.protect, questionController.getquestionBankByPaperID) ;
router
  .route("/paper/getExamInfoForStuByLessonID")
  .post(authController.protect, questionController.getExamInfoForStuByLessonID) ;
router
  .route("/paper/updateStudentPaper")
  .post(authController.protect, questionController.updateStudentPaper) ;
router
  .route("/paper/updateExamPaperStatus")
  .post(authController.protect, questionController.updateExamPaperStatus) ;
  
router
  .route("/paper/:id")
  .delete(authController.protect, questionController.deletePaper) ;
// router
//   .route("/:id")
//   .get(authController.protect, questionController.getQuestion) 
//   .patch(authController.protect, questionController.updateQuestion) 
//   .delete(authController.protect, questionController.deleteQuestion); 

module.exports = router;

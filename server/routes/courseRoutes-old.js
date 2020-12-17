const express = require("express");
const courseController = require("../controller/courseController-old");
const authController = require("../controller/authController");
// const reviewRouter = require('../routes/reviewRoutes');
// const userRouter = require('../routes/userRoutes');

const router = express.Router();

// router.use('/:courseId/reviews', reviewRouter);
// router.use('/:courseId/users', userRouter);

router
  .route("/")
  .get(authController.protect, courseController.getAllCourses)
  .post(authController.protect, courseController.createCourse);

router
  .route("/:id")
  .get(authController.protect, courseController.getCourse)
  .patch(authController.protect, courseController.updateCourse)
  .delete(authController.protect, courseController.deleteCourse);

module.exports = router;

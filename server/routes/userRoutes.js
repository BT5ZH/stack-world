const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");

// const courseRouter = require('../routes/courseRoutes');

const router = express.Router({ mergeParams: true });

// router.use('/:userId/courses', courseRouter);

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.updateMe
);

router
  .route("/")
  .get(authController.protect, userController.getAllUsers)
  .post(userController.createUser);

router.route("/admin").post(userController.createAdmin);
router.route("/teacher").post(userController.createTeacher);
router.route("/student").post(userController.createStudent);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(userController.deleteUser)
  .post(authController.protect, userController.updateUserRecords);

module.exports = router;

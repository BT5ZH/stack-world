const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");

// const courseRouter = require('../routes/courseRoutes');

const router = express.Router({ mergeParams: true });

// router.use('/:userId/courses', courseRouter);

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassword);

router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.updateMe
);

router
  .route("/")
  .get(authController.protect, userController.getAllUsers)
  .post(authController.protect,userController.createUser);

router.route("/admin").post(userController.createAdmin);
router.route("/teacher").post(userController.createTeacher);
router.route("/student").post(userController.createStudent);
router.route("/classList").post(userController.getClassList);

router
  .route("/multipleUsers")
  .get(userController.getOrgTeachers)
  .post(userController.createMultipleUsers);

router
  .route("/allOrgAdmin")
  .get(authController.protect, userController.getOrgTeachers);
router
  .route("/getTeachersBySubOrgName")
  .post(authController.protect, userController.getTeachersBySubOrgName);
router
  .route("/getUsersBySubOrgAndSortByTitle")
  .get(authController.protect, userController.getUsersBySubOrgAndSortByTitle);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(userController.deleteUser)
  .post(authController.protect, userController.updateUserRecords);

module.exports = router;

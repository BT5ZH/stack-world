const express = require("express");
const liveActivityController = require("../controller/liveActivityController");
const authController = require("../controller/authController");
const socketOP = require("../utils/socket");

const router = express.Router();

router
  .route("/")
  .post(authController.protect, liveActivityController.createActivity);

// router
//   .route("/:activity_id")
//   .post(authController.protect, liveActivityController.createActivity);

router
  .route("/user_sig")
  .post(authController.protect, liveActivityController.genUserSig);

router
  .route("/online_list/:lesson_id")
  .get(authController.protect, socketOP.getMemberListInLesson)
  .delete(authController.protect, socketOP.clearMembersOfLesson);
module.exports = router;

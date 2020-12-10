const express = require("express");
const setHomeworkController = require("../controller/setHomeworkController");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, setHomeworkController.getAllSetHomework)
  .post(authController.protect, setHomeworkController.createSetHomewrok);
router
  .route("/:id")
  .get(authController.protect, setHomeworkController.getSetHomework)
  .patch(authController.protect, setHomeworkController.updateSetHomework)
  .delete(authController.protect, setHomeworkController.deleteSetHomework);

module.exports = router;

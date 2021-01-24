const express = require("express");
const schoolYearController = require("../controller/schoolYearController");
const authController = require("../controller/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(authController.protect, schoolYearController.getCurrentSchoolYear);

router
  .route("/getAllSchoolYear")
  .get(authController.protect, schoolYearController.getAllSchoolYear);
router
  .route("/addSchoolYear")
  .post(authController.protect, schoolYearController.addSchoolYear);
router
  .route("/deleteSchoolYear")
  .delete(authController.protect, schoolYearController.deleteSchoolYear);
router
  .route("/updateSchoolYear")
  .post(authController.protect, schoolYearController.updateSchoolYear);

router.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json");
  next();
});

module.exports = router;

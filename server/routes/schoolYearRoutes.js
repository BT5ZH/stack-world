const express = require("express");
const schoolYearController = require("../controller/schoolYearController");
const authController = require("../controller/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/getCurrentSchoolYear")
  .post(authController.protect, schoolYearController.getCurrentSchoolYear);
  //.post(authController.protect, schoolYearController.createSchoolYear);

router
  .route("/getAllSchoolYears")
  .get(authController.protect, schoolYearController.getAllSchoolYears);

router
  .route("/getAllSchoolYear")
  .get(authController.protect, schoolYearController.getAllSchoolYear);
router
  .route("/changeCurrentSYtoNomarl")
  .post(authController.protect, schoolYearController.changeCurrentSYtoNomarl);
  
router
  .route("/addSchoolYear")
  .post(authController.protect, schoolYearController.addSchoolYear);
router
  .route("/:id")
  .delete(authController.protect, schoolYearController.deleteSchoolYear)
  .patch(authController.protect, schoolYearController.updateSchoolYear);


router.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json");
  next();
});

module.exports = router;

const express = require("express");
const schoolYearController = require("../controller/schoolYearController");

const router = express.Router({ mergeParams: true });

router.route("/getAllSchoolYear").get(schoolYearController.getAllSchoolYear);
router.route("/addSchoolYear").post(schoolYearController.addSchoolYear);
router.route("/deleteSchoolYear").delete(schoolYearController.deleteSchoolYear);
router.route("/updateSchoolYear").post(schoolYearController.updateSchoolYear);

router.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json");
  next();
});

module.exports = router;

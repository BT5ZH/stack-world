const express = require('express');
const prepareCourseController = require('../controller/prepareCourseController');

const router = express.Router({ mergeParams: true });

router
.route('/createPrepareCourse')
.post(prepareCourseController.createPrepareCourse);

router.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json");
  next();
});


module.exports = router;

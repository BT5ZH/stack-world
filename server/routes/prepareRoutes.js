const express = require('express');
const prepareLessonController = require('../controller/prepareLessonController');

const router = express.Router({ mergeParams: true });

router
.route('/createOnePrepareLesson')
.post(prepareLessonController.createOnePrepareLesson);

router
.route('/deleteOnePrepareLesson')
.delete(prepareLessonController.deleteOnePrepareLesson);

router.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json");
  next();
});


module.exports = router;

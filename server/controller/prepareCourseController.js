const PrepareCourse = require('../models/prepareCourseModel');
const catchAsync = require('../utils/catchAsync');


exports.createPrepareCourse = catchAsync(async (req, res) => {
  var prepareCourse=req.body;
  try {
    //console.log("prepareCourse:",prepareCourse)
    const PC = await PrepareCourse.create(prepareCourse)

    res.status(200).json({
      status: 'success',
      data: {
        PC,
        msg:"hahha"
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err });
  }

});
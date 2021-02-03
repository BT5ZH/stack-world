const SubmitHomeworks = require("../models/submitHomeworkModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllSubmitHomework = catchAsync(async (req, res, next) => {
  // BUILD QUERY
  // 1) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // 2) Advanced filtering
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|le)\b/g,
    (match) => `$${match}`
  );
  // console.log(queryString);
  const query = SubmitHomeworks.find(JSON.parse(queryString));
  // console.log(query);
  // EXECUTE QUERY
  const submitHomework = await query;
  // console.log(courses);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    resulrs: submitHomework.length,
    data: {
      submitHomework,
    },
  });
});

exports.createSubmitHomewrok = catchAsync(async (req, res, next) => {
  // const oldHomework = await SubmitHomeworks.findOne({
  //   homework_id: req.body.homework_id,
  //   student_id: req.body.student_id,
  // });
  // if (!oldHomework) {
    try{
  const newHomewrok = await SubmitHomeworks.findOneAndUpdate(
    { 
      homework_id: req.body.homework_id, 
      student_id:req.body.student_id
    },
    req.body,
    {upsert: true, new: true, setDefaultsOnInsert: true}//此行代码约定此条记录不存在则创建一条新记录
  );
  // if (!newHomewrok) {
  //   return next(new AppError("作业创建失败", 500));
  // }
  res.status(201).json({
    status: "success",
    newHomewrok,
  });
}catch(err){console.log(err)}
  // } else {
  //   return next(new AppError("本节课作业布置已经存在", 500));
  // }
});

exports.getSubmitHomework = catchAsync(async (req, res, next) => {
  const homework = await SubmitHomeworks.findById(req.params.id);

  if (!homework) {
    return next(new AppError("该作业不存在", 404));
  }

  res.status(200).json({
    status: "success",
    homework,
  });
});
exports.getSubmitHomeworkByIDandStudentID = catchAsync(
  async (req, res, next) => {
    const homework = await SubmitHomeworks.findOne({
      homework_id: req.body.homework_id,
      student_id: req.body.student_id,
    })
      .populate("student_id", "user_id name -_id")
      .populate({
        path: 'homework_id',
        select: ['_id', 'lesson_id'],

        populate: {
          path: 'lesson_id',
          select: ['_id', 'course_id'],

          populate: {
            path: 'course_id',
            select: ['_id', 'name']
          }
        }
      })

    if (!homework) {
      return next(new AppError("该作业不存在", 404));
    }

    res.status(200).json({
      status: "success",
      homework,
    });
  }
);
exports.updateSubmitHomework = catchAsync(async (req, res, next) => {
  const submitHomework = await SubmitHomeworks.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!submitHomework) {
    return next(new AppError("该作业不存在", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      submitHomework,
    },
  });
});

exports.deleteSubmitHomework = catchAsync(async (req, res, next) => {
  const submitHomework = await SubmitHomeworks.findByIdAndDelete(req.params.id);

  if (!submitHomework) {
    return next(new AppError("该作业不存在", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

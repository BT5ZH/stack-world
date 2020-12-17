const SubmitHomeworks = require("../models/submitHomeworkModel");
const catchAsync = require("../utils/catchAsync");

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
  const newsubmitHomewrok = await SubmitHomeworks.create(req.body);
  res.status(201).json({
    status: "success",
    data: newsubmitHomewrok,
  });
});

exports.getSubmitHomework = catchAsync(async (req, res, next) => {
  const submitHomework = await SubmitHomeworks.findById(req.params.id);

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

const SetHomework = require("../models/setHomeworkModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllSetHomework = catchAsync(async (req, res, next) => {
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
 
  const query = SetHomework.find(JSON.parse(queryString))
  //.select("_id lesson_id number_of_time content ");

  const setHomework = await query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    resulrs: setHomework.length,
    data: {
      setHomework,
    },
  });
});

exports.createSetHomewrok = catchAsync(async (req, res, next) => {
  const newSetHomewrok = await SetHomework.create(req.body);
  res.status(201).json({
    status: "success",
    data: newSetHomewrok,
  });
});

exports.getSetHomework = catchAsync(async (req, res, next) => {
  const setHomework = await SetHomework.findById(req.params.id);

  if (!setHomework) {
    return next(new AppError("该作业布置不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      setHomework,
    },
  });
});

exports.updateSetHomework = catchAsync(async (req, res, next) => {
  const setHomework = await SetHomework.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!setHomework) {
    return next(new AppError("该作业布置不存在", 404));
  }
  res.status(200).json({
    status: "scccess",
    data: {
      setHomework,
    },
  });
});

exports.deleteSetHomework = catchAsync(async (req, res, next) => {
  const setHomework = await SetHomework.findByIdAndDelete(req.params.id);

  if (!setHomework) {
    return next(new AppError("该作业布置不存在", 404));
  }

  res.status(204).json({
    status: "scccess",
    data: null,
  });
});

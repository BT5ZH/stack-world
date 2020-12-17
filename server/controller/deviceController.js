const Device = require("../models/deviceModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllDevices = catchAsync(async (req, res, next) => {
  console.log("getAllDevices getAllDevices 进来啦");

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
  const query = Device.find(JSON.parse(queryString)).select(
    "deviceName subOrgs"
  );
  //   console.log(query);
  // EXECUTE QUERY
  const devices = await query;
  console.log(devices);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: devices.length,
    data: {
      devices,
    },
  });
});

exports.createDevice = catchAsync(async (req, res, next) => {
  const newDevice = await Device.create(req.body);
  res.status(201).json({
    status: "success",
    data: newDevice,
  });
});

exports.getDevice = catchAsync(async (req, res, next) => {
  console.log("getClass 进来啦");

  const device = await Device.findById(req.params.id);

  if (!device) {
    return next(new AppError("该设备不存在", 404));
  }

  console.log(device);
  res.status(200).json({
    status: "success",
    data: {
      device,
    },
  });
});

exports.updateDevice = catchAsync(async (req, res, next) => {
  const device = await Device.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!device) {
    return next(new AppError("该班级不存在", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      device,
    },
  });
});

exports.deleteDevice = catchAsync(async (req, res, next) => {
  const device = await Device.findByIdAndDelete(req.params.id);

  if (!device) {
    return next(new AppError("该机构不存在", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const Room = require("../models/roomModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllRooms = catchAsync(async (req, res, next) => {
  console.log("roomController getAllRooms 进来啦");

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
  const query = Room.find(JSON.parse(queryString)).select(
    "room_number room_type campus building empty"
  );
  //   console.log(query);
  // EXECUTE QUERY
  const rooms = await query;
  console.log(rooms);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: rooms.length,
    data: {
      rooms,
    },
  });
});

exports.createRoom = catchAsync(async (req, res, next) => {
  const newRoom = await Room.create(req.body);
  res.status(201).json({
    status: "success",
    data: newRoom,
  });
});

exports.getRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return next(new AppError("该空间不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      room,
    },
  });
});

exports.updateRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!room) {
    return next(new AppError("该空间不存在", 404));
  }
  res.status(200).json({
    status: "scccess",
    data: {
      room,
    },
  });
});

exports.deleteRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findByIdAndDelete(req.params.id);

  if (!room) {
    return next(new AppError("该空间不存在", 404));
  }

  res.status(204).json({
    status: "scccess",
    data: null,
  });
});

exports.batchAddRooms = catchAsync(async (req, res, next) => {
  var rooms = req.body;
  await Room.insertMany(rooms, { ordered: false });
  res.status(200).json({
    status: true,
  });
});

exports.batchDeleteRooms = catchAsync(async (req, res, next) => {
  var rooms = req.body.rooms._id;
  await Room.deleteMany({ _id: { $in: rooms } }, { ordered: false });
  res.status(200).json({
    status: true,
  });
});

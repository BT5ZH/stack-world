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

// // 一个building中空房间的 数量
// exports.getEmptyNum = catchAsync(async (req, res, next) => {
//   const empty = await Room.aggregate([
//     {
//       // match :filter object
//       $match: { empty: { $eq: true } },
//     },
//     {
//       $group: {
//         _id: "$building", //what we want to group by; toUpper: spell by UPPER case
//         count: { $sum: 1 }, // 1: quantity of each number counter
//       },
//     },
//   ]);

//   res.status(200).json({
//     status: "success",
//     data: {
//       empty,
//     },
//   });
// });

// // 不同building中 空房间 的 类型和数量
// ex
// ports.getEmptyType = catchAsync(async (req, res, next) => {

//   const number = await Room.aggregate([
//     {
//       $match: { empty: { $eq: true } },
//     },
//     {
//       $group: {
//         _id: "$roomType",
//         emptyNumber: { $sum: 1 },
//         building: { $push: "$building" },
//       },
//     },
//   ]);

//   res.status(200).json({
//     status: "success",
//     data: {
//       empty,
//     },
//   });
// });

const Room = require("../models/roomModel");
const Campus = require("../models/campusModel");
const Building = require("../models/buildingModel");
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
  const query = Room.find(JSON.parse(queryString));
  // .select("room_number room_type campus building empty")
  // .populate({
  //   path: "lesson_id",
  //   select: ["course_id"],
  // });
  //   console.log(query);
  // EXECUTE QUERY
  const rooms = await query;
  console.log(rooms);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: rooms.length,

    rooms,
  });
});

exports.createRoom = catchAsync(async (req, res, next) => {
  // const oldRoom = await Room.findOne({
  //   room_number: req.body.room_number,
  //   building: req.body.building,
  // });
  // if (!oldRoom) {
  const newRoom = await Room.create(req.body);
  if (!newRoom) {
    return next(new AppError("空间创建失败", 500));
  }
  res.status(201).json({
    status: "success",
    data: newRoom,
  });
  // } else {
  //   return next(new AppError("本空间已经存在", 500));
  // }
});

exports.getRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findOne({ _id: req.params.id });

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

exports.getRoomByBuilding = catchAsync(async (req, res, next) => {
  const rooms = await Building.findOne({ _id: req.query.building_id }).populate(
    "rooms"
  );

  if (rooms === [] || rooms === null) {
    return next(new AppError("该楼无教室", 404));
  }

  res.status(200).json({
    status: "success",
    rooms,
  });
});
exports.getRoomByCampusAndBuilding = catchAsync(async (req, res, next) => {
  const rooms = await Campus.findOne({ _id: req.query.campus_id }).populate({
    path: "buildings",
    select: ["_id", "rooms"],
    // model: 'College',
    populate: {
      path: "rooms",
      select: [
        "_id",
        "room_number",
        "room_name",
        "room_type",
        "room_charge_person",
        "room_duty_person",
      ],
      // model: 'Student'
    },
  });
  if (rooms === [] || rooms === null) {
    return next(new AppError("该楼无教室", 404));
  }

  res.status(200).json({
    status: "success",
    rooms,
  });
});
exports.getRoomByCampusOrBuilding = catchAsync(async (req, res, next) => {
  var data;
  if (req.query.building_id != null)
    data = await Building.findOne({ _id: req.query.building_id })
    .populate("rooms");
  else {
    data = await Campus.findOne({ _id: req.query.campus_id }).populate({
      path: "buildings",
      select: ["_id", "building_name", "rooms", "building_type"],

      populate: {
        path: "rooms",
        select: [
          "_id",
          "room_number",
          "room_name",
          "room_type",
          "room_charge_person",
          "room_duty_person",
        ],
      },
    });
  }

  if (data === [] || data === null) {
    return next(new AppError("该楼无教室", 404));
  }

  res.status(200).json({
    status: "success",
    data,
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
    status: "success",
    data: {
      room,
    },
  });
});
//this function will trigger the model middleware 'roomSchema.pre("remove", { query: true }, async function (doc) {...}'
exports.deleteRoom = catchAsync(async (req, res, next) => {
  //const room = await Room.findByIdAndDelete(req.params.id);
  const room = await Room.findById(req.params.id);

  //const room = await Room.remove({_id:req.params.id});
  if (!room) {
    return next(new AppError("该空间不存在", 404));
  }
  await room.remove(); 
  res.status(204).json({
    status: "success",
    room,
  });
});

exports.batchAddRooms = catchAsync(async (req, res, next) => {
  var rooms = req.body;
  await Room.insertMany(rooms, { ordered: false });
  res.status(200).json({
    status: "success",
  });
});

exports.batchDeleteRooms = catchAsync(async (req, res, next) => {
  var rooms = req.body.rooms._id;
  await Room.deleteMany({ _id: { $in: rooms } }, { ordered: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

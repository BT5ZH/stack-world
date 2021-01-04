const Building = require("../models/buildingModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/* 

  提供教学楼(Building)信息管理与维护，如增删改查、导入
  
*/

exports.getAllBuildings = catchAsync(async (req, res, next) => {
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
  const query = Building.find(JSON.parse(queryString)).select("name type");
  //   console.log(query);
  // EXECUTE QUERY
  const buildings = await query;
  console.log(buildings);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: buildings.length,
    data: {
      buildings,
    },
  });
});

exports.getBuilding = catchAsync(async (req, res, next) => {
  const building = await Building.findById(req.params.id);

  if (!building) {
    return next(new AppError("该校区不存在", 404));
  }

  console.log(building);
  res.status(200).json({
    status: "success",
    data: {
      building,
    },
  });
});

exports.createBuilding = catchAsync(async (req, res, next) => {
  const newBuilding = await Building.create(req.body);
  res.status(201).json({
    status: "success",
    data: newBuilding,
  });
});

exports.updateBuilding = catchAsync(async (req, res, next) => {
  const building = await Building.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!building) {
    return new new AppError("该校区不存在", 404)();
  }
  res.status(200).json({
    status: "success",
    data: {
      building,
    },
  });
});

exports.deleteBuilding = catchAsync(async (req, res, next) => {
  // const building = await Building.findByIdAndDelete(req.params.id);

  // if (!building) {
  //   return next(new AppError("该校区不存在", 404));
  // }

  // res.status(204).json({
  //   status: "success",
  //   data: "success deleted!",
  // });

  const building = await Building.findById(req.params.id);

  //const room = await Room.remove({_id:req.params.id});
  if (!building) {
    return next(new AppError("该空间不存在", 404));
  }
  await building.remove();
  res.status(204).json({
    status: "success",
    building,
  });
});

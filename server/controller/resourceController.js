const Resource = require("../models/resourceModel");
const catchAsync = require("./../utils/catchAsync");
const { assumeRole } = require("../utils/aws");

exports.uploadResource = async (req, res) => {
  try {
    //获取凭证
    const Credentials = await assumeRole();

    console.log(req.body);
    //将信息插入数据库
    const newResource = await Resource.create(req.body);

    //返回信息
    res.status(200).json({
      status: "success",
      message: "上传成功",
      credentials: { ...Credentials },
      fileID: newResource.toObject()._id,
    });
  } catch (err) {
    console.log("上传失败");
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getAllResources = catchAsync(async (req, res, next) => {
  console.log("organizationController getAllResources 进来啦");

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
  console.log(queryString);
  const query = Resource.find(JSON.parse(queryString))
    .select("name tags rsType url duration size click")
    .populate("authorId", "name -_id");

  //   console.log(query);
  // EXECUTE QUERY
  const resources = await query;
  console.log(resources);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: resources.length,
    resources,
  });
});

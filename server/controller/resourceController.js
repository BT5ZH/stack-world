const Resource = require("../models/resourceModel");
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

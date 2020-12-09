const multer = require("multer");
const AppError = require("./../utils/appError");

const Resource = require("../models/resourceModel");
const { assumeRole } = require("..utils/aws");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/video/users");
  },
  filename: (req, file, cb) => {
    // user-ididid-3333333.jpeg
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.body.userId}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Not an video! The course only support video.mp4 format",
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadResourceFile = upload.single("video");

exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find();

    res.status(200).json({
      status: "success",
      resulrs: resources.length,
      data: {
        resources,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.createResource = async (req, res) => {
  try {
    console.log(req.body);
    const newResource = await Resource.create(req.body);
    res.status(201).json({
      status: "scccess",
      data: newResource,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

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
      data: { credentials: Credentials, fileID: newResource._id },
    });
  } catch (err) {
    console.log("上传失败");
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const express = require("express");
const buildingController = require("../controller/buildingController");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, buildingController.getAllBuildings) // 获取某校区所有建筑信息
  .post(authController.protect, buildingController.createBuilding); // 新建建筑信息

router
  .route("/:id")
  .get(authController.protect, buildingController.getBuilding) // 获取指定建筑信息
  .patch(authController.protect, buildingController.updateBuilding) // 更新指定建筑信息
  .delete(authController.protect, buildingController.deleteBuilding); //删除指定建筑信息

module.exports = router;

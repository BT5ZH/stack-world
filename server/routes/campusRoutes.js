const express = require("express");
const campusController = require("../controller/campusController");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, campusController.getAllCampus) // 获取某组织所有校区及建筑信息
  .post(authController.protect, campusController.createCampus); // 新建校区信息

router
  .route("/:id")
  .get(authController.protect, campusController.getCampus) // 获取指定校区及所有建筑信息
  .patch(authController.protect, campusController.updateCampus) // 更新指定校区信息
  .delete(authController.protect, campusController.deleteCampus); //删除指定校区信息

router
  .route("/:id/buildings/")
  .post(authController.protect, campusController.addBuilding) // 新建建筑信息
  .delete(authController.protect, campusController.deleteBuilding); // 删除指定建筑信息

module.exports = router;

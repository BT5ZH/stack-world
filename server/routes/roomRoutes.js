const express = require("express");
const roomController = require("../controller/roomController");
const authController = require("../controller/authController");

const router = express.Router();

// router
//   .route('/empty-room-num')
//   .get(authController.protect, roomController.getEmptyNum); // 获取教学楼空房间
// router
//   .route('/empty-room-type')
//   .get(authController.protect, roomController.getEmptyType); // 获取教学楼空房间

router
  .route("/")
  .get(authController.protect, roomController.getAllRooms)
  .post(authController.protect, roomController.createRoom);

router
  .route("/batchAddRooms")
  .post(authController.protect, roomController.batchAddRooms); // 批量添加房间
router
  .route("/batchDeleteRooms")
  .post(authController.protect, roomController.batchDeleteRooms); //批量删除房间
router
  .route("/getRoomByBuilding")
  .post(authController.protect, roomController.getRoomByBuilding); 
  
router
  .route("/:id")
  .get(authController.protect, roomController.getRoom)
  .patch(authController.protect, roomController.updateRoom)
  .delete(authController.protect, roomController.deleteRoom);

module.exports = router;

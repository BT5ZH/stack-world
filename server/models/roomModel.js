const mongoose = require("mongoose");
const uuid = require("uuid");

const roomSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "you must tell us your id"],
      default: uuid.v1,
    },
    room_number: {
      type: Number,
      required: [true, "room must have a number"],
    },
    room_name: {
      type: String,
      default: "room name",
    },
    room_type: {
      type: String,
      required: [true, "room bust have a type"],
      enum: {
        values: ["教室", "实验室", "办公室", "会议室", "报告厅", "其他"],
      },
    },
    room_charge_person: {
      type: String,
      ref: "User",
    },
    room_duty_person: {
      type: String,
      ref: "User",
    },
    building_name: {
      type: mongoose.Schema.Types.String,
    },
    campus_name: {
      type: mongoose.Schema.Types.String,
    },
    // 以下两个数据 插入数据时忽略
    ////////////////////////////////////////////////////
    section: {
      type: Number,
    },
    floor: {
      type: Number,
    },
    ///////////////////////////////////////////////////
  },
  { _id: false }
);
/*
roomSchema.post('findOne', function(result) {
  if(result!=null){
    if(result.room_type==='classroom')   result.room_type = "教室"
    else if(result.room_type==='lab')    result.room_type = "实验室"
    else if(result.room_type==='office') result.room_type = "办公室"
    else if(result.room_type==='others') result.room_type = "其他"
  }
});
roomSchema.post('find', function(result) {
  if(result!=[] || result!= null ){
    for(let i = 0;i<result.length;i++){
      if(result[i].room_type==='classroom')   result[i].room_type = "教室"
      else if(result[i].room_type==='lab')    result[i].room_type = "实验室"
      else if(result[i].room_type==='office') result[i].room_type = "办公室"
      else if(result[i].room_type==='others') result[i].room_type = "其他"
    }
  }
});
*/
const Room = mongoose.model("Room", roomSchema);

module.exports = Room;

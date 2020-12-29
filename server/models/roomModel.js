const mongoose = require("mongoose");
const uuid = require("uuid");
const Building = require("./buildingModel");

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
    org_name: {
      type: String,
      required: [true, "A room must belong to one university or school"],
    },
    building_name: {
      type: mongoose.Schema.Types.String,
      required: [true, "A room must belong to one building"],
    },
    campus_name: {
      type: mongoose.Schema.Types.String,
      required: [true, "A room must belong to one campus"],
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
roomSchema.post('save', async function (doc) {
  const building = await Building.findOne({ 
    org_name: doc.org_name, 
    campus_name: doc.campus_name,
    building_name: doc.building_name }
  )
  if(building != null){
    let room = building.rooms
  
    if(room.indexOf(doc._id)===-1)
      room.push(doc._id)
    
    await Building.updateOne(
      { _id: building._id },
      { $set: { rooms: room }
    })
  }
});
roomSchema.pre('remove', {  query: true } ,async function (doc) {

  const building = await Building.findOne({ 
    org_name: this.org_name, 
    campus_name: this.campus_name,
    building_name: this.building_name }
  )
  if(building != null){
    let room = []

    for(let i=0;i<building.rooms.length;i++){
       if(building.rooms[i]!=this._id)
          room.push(building.rooms[i])
    }
  
    await Building.updateOne(
      { _id: building._id },
      { $set: { rooms: room }
    })
  }
});
const Room = mongoose.model("Room", roomSchema);

module.exports = Room;

const mongoose = require("mongoose");
const uuid = require("uuid");

const buildingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "you must tell us your building id"],
      default: uuid.v1,
    },
    building_name: {
      type: String,
      default: "楼名",
      required: [true, "building must have a name"],
    },
    type: {
      type: String,
      //required: [true, "building must have a type"],
    },
    rooms: [
      {
        type: mongoose.Schema.Types.String,
        ref: 'Room',
      },
    ],
    campus_name: {
      type: mongoose.Schema.Types.String,
      required: [true, "A building must belong to one campus"],
    },
    org_name: {  
      type: String,
      required: [true, "A building must belong to one university or school"],
    },
  },
  {
    _id: false,
  }
);

const Building = mongoose.model("Building", buildingSchema);

module.exports = Building;

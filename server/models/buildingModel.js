const mongoose = require("mongoose");
const uuid = require("uuid");

const buildingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true,'you must tell us your building id'],
      default:uuid.v1,
    },
    name: {
      type: String,
      default: "楼名",
      required: [true, "building must have a name"],
    },
    type: {
        type: String,
        //required: [true, "building must have a type"],
      },
    org_id: {  
        type: String,
      },
    campus: {  
        type: mongoose.Schema.Types.String,
        ref: 'Campus',
      },
  },
  {
    _id:false
  }
);

const Building = mongoose.model("Building", buildingSchema);

module.exports = Building;

const mongoose = require("mongoose");
const uuid = require("uuid");

const roomSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true,'you must tell us your id'],
      default:uuid.v4().replace(/\-/g, ''),
    },
    roomNumber: {
      type: Number,
      required: [true, "room must have a number"],
    },
    roomType: {
      type: String,
      required: [true, "room bust have a type"],
      enum: {
        values: ["classroom", "lab", "office", "others"],
      },
    },
    building: { 
      type: mongoose.Schema.Types.String,
      ref: 'Building', 
    },
    ////////////////////////////////////////////////////
    section: { 
      type: Number, default: 1 
    },
    floor: { 
      type: Number, default: 1 
    },
    ///////////////////////////////////////////////////
  },{_id:false}
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;

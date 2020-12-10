const mongoose = require("mongoose");
const uuid = require("../node_modules/uuid/dist");

const roomSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true,'you must tell us your id'],
      default:uuid.v1,
    },
    roomNumber: {
      type: Number,
      required: [true, "room must have a number"],
    },
    section: { type: Number, default: 1 },
    floor: { type: Number, default: 1 },
    roomType: {
      type: String,
      required: [true, "room bust have a type"],
      enum: {
        values: ["classroom", "lab", "office", "others"],
      },
    },

    org_id: {  
      type: mongoose.Schema.Types.String,
      ref: 'Org',
    },
    campus: {  
      type: mongoose.Schema.Types.String,
      ref: 'Campus',
    },
    building: { 
      type: mongoose.Schema.Types.String,
      ref: 'Building', 
    },
  },{_id:false}
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;

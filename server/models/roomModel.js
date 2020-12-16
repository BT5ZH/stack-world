const mongoose = require("mongoose");
const uuid = require("uuid");

const roomSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "you must tell us your id"],
      default: uuid.v4,
    },
    room_number: {
      type: Number,
      required: [true, "room must have a number"],
    },
    room_type: {
      type: String,
      required: [true, "room bust have a type"],
      enum: {
        values: ["classroom", "lab", "office", "others"],
      },
    },
    building: {
      type: mongoose.Schema.Types.String,
      ref: "Building",
    },
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

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;

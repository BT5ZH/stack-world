const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
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

    // empty: { type: Boolean, required: true },
    organization: { type: String, required: true },
    campus: { type: String, required: true },
    building: { type: String, required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

roomSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "room",
  localField: "_id",
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;

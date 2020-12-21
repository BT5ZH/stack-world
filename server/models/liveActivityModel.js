const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    activityID: {
      type: String,
      required: [true, "class must have an activityID"],
      unique: true,
    },
    activityNumber: {
      type: Number,
      required: [true, "class must have an activityNumber"],
    },
    activityLocation: {
      type: String,
      required: [true, "class must have an activityLocation"],
    },
    activityStatus: {
      type: String,
      enum: ["preparing", "running", "finished"],
    },
    activityStartTime: {
      type: Date,
      default: Date.now(),
    },
    activityEndTime: {
      type: Date,
    },
    onlineStudentsNumber: {
      type: Number,
    },
    org: { type: String, required: true },
    subOrg: { type: String, required: true },
    liveContent: { type: String },
    teacher: { type: String, required: true },
    attendance: {
      list: { type: Array },
      rate: { type: String },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;

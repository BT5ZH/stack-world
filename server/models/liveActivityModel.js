const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    activityID: {
      type: String,
      required: [true, "class must have an activityID"],
      unique: true,
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
    },
    activityEndTime: {
      type: Date,
    },
    onlineStudentsNumber: {
      type: Number,
    },
    org: { type: String, required: true },
    subOrg: { type: String, required: true },
    liveContent: { type: String, required: true },
    teacher: { type: String, required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;

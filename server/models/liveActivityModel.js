const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    activity_id: {
      type: String,
      required: [true, "activity must have an activity_id"],
    },
    activity_index: {
      type: Number,
      required: [true, "activity must have an activity_index"],
    },
    activity_location: {
      type: String,
      required: [true, "activity must have an activity_location"],
    },
    activity_location_id: {
      type: String,
      required: [true, "activity must have an activity_location_id"],
    },
    // activity_status: {
    //   type: String,
    //   enum: ["preparing", "running", "finished"],
    // },
    start_time: {
      type: Date,
      default: Date.now(),
    },
    end_time: {
      type: Date,
    },
    org_name: { type: String, required: true },
    sub_org_name: { type: String, required: true },
    teacher_name: { type: String, required: true },
    phases: {
      type: [
        {
          phase_time: { type: Number },
          phase_type: { type: String, enum: ["sign", "vote", "test", "call"] },
        },
      ],
    },
    sign_data: {
      type: [
        {
          total_number: { type: Number },
          real_number: { type: Number },
          class_name: { type: String },
          class_list: {
            studentId: { type: String },
            studentName: { type: String },
            enterTime: { type: Date },
            signed: { type: String },
          },
        },
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;

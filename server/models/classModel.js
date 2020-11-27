const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      default: "专业名-20XX级-1班 ",
      required: [true, "class must have an className"],
      unique: true,
    },
    major: { type: String, required: true },
    subOrg: { type: String, required: true },
    org: { type: String, required: true },
    tags: {
      type: [String],
      //   validate: (o) => Array.isArray(o) && o.length > 0,
    },
    staff: {
      manager: { type: String, required: true },
    },
    students: {
      type: [
        {
          studentID: { type: String, required: true },
          studentName: { type: String, required: true },
          remark: { type: String, default: "remark" },
        },
      ],
      //   validate: (o) => Array.isArray(o) && o.length > 0,
    },
    curriculum: {
      type: [
        {
          courseID: { type: String, required: true },
          courseName: { type: String, required: true },
          courseStartYear: { type: Date, required: true },
          courseSemaster: {
            type: String,
            required: true,
            enum: ["spring", "autumn"],
          },
          courseDuration: { type: Number, required: true },
          timeTable: {
            type: [
              {
                date: {
                  type: String,
                  required: true,
                  enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                },
                order: { type: [Number] },
                location: { type: String, required: true },
              },
            ],
          },
        },
      ],
    },
    enrollmentTime: {
      type: Date,
    },
    graduateTime: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Class = mongoose.model("Class", classSchema);

module.exports = Class;

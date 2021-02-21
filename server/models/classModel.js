const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    class_name: {
      type: String,
      default: "专业名-20XX级-1班 ",
      required: [true, "class must have an className"],
      unique: true,
    },
    org_name: { type: String, required: [true, "class must have an org_name"] },
    subOrg_name: {
      type: String,
      required: [true, "class must have an subOrg_name"],
    },
    major_name: {
      type: String,
      required: [true, "class must have an major_name"],
    },
    students: [
      {
        type: String,
        ref: "User",
      },
    ],
    lessons: [
      {
        lesson: { type: String, ref: "Lesson" },
        time_tables: [{ type: String, ref: "TimeTable" }],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { _id: false }
);

classSchema.virtual("studentList", {
  ref: "User",
  localField: "students",
  foreignField: "_id",
  justOne: false,
});
const Class = mongoose.model("Class", classSchema);

module.exports = Class;

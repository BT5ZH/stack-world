const mongoose = require("mongoose");
const uuid = require("../node_modules/uuid/dist");

const courseBaseSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please tell us the ID"],
      default: uuid.v1,
    },
  },
  { _id: false }
);

const courseBase = mongoose.model("CourseBase", courseBaseSchema);

module.exports = courseBase;

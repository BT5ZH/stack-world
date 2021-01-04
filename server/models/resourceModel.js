const mongoose = require("mongoose");
const uuid = require("uuid");
const resourceSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: [true, "you must tell us your id"],
    default: uuid.v1,
  },
  name: {
    type: String,
    required: [true, "A resource must have a name"],
  },
  authorId: {
    type: mongoose.Schema.Types.String,
    ref: "User",
    required: [true, "A resource must have an authorId"],
  },
  url: {
    type: String,
    required: [true, "A resource must have a rul"],
  },
  duration: {
    type: Number,
    required: [true, "A resource must have a duration"],
  },
  size: {
    type: Number,
    required: [true, "A resource must have a number"],
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  rsType: {
    type: String,
    required: [true, "A resource must have a resourceType"],
    enum: ["mp4", "pdf", "doc", "jpeg", "jpg", "png", "docx"],
  },
  tags: {
    select: false,
    type: Array,
  },
  click: {
    type: Number,
    default: 0,
  },
  course_id: {
    type: String,
    ref: "Course",
  },
  lesson_id: {
    type: String,
    ref: "Lesson",
  }
},{ _id: false });

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;

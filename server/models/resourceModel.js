const mongoose = require("mongoose");
const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A resource must have a name"],
  },
  authorId: {
    type: String,
    required: [true, "A resource must have an authorId"],
  },
  url: {
    type: String,
    required: [true, "A resource must have a rul"],
  },
  duration: {
    type: Number,
    required: [true, "A resource must have a rul"],
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
});

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;

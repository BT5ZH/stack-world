const mongoose = require('mongoose');
const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A resource must have a name'],
  },
  authorId: {
    type: String,
    required: [true, 'A resource must have an authorId'],
  },
  // type: {
  //   type: String,
  //   required: [true, 'A resource must have a resourceType'],
  // },
  
  type: {
    type: mongoose.Schema.Types.String,
    required: [true, 'A resource must have a resourceType'],
    ref: 'ResourceType',
  },

  url: {
    type: String,
    required: [true, 'A resource must have a rul'],
  },
  duration: {
    type: Number,
    required: [true, 'A resource must have a rul'],
  },
  size: {
    type: Number,
    required: [true, 'A resource must have a number'],
  },
  createTime: {
    type: Date,
    required: [true, 'A resource must have a createTime'],
  },
  tag: {
    select: false,
    type: [
      {
        chapterIndex: String,
        courseId: String,
        lessonIndex: String,
      },
    ],
  },
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;

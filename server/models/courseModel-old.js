const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    announcement: {
      type: String,
      default: '本课程暂无公告',
    },
    creatorId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'course must have a creatorId'],
    },
    chapterCounter: {
      type: Number,
      // required: [true, 'A course must have a chapterNumber'],
      default: 0,
    },

    description: {
      type: String,
      required: [true, 'A course must have a description'],
    },
    duration: {
      type: Number,
    },
    imageUrl: {
      type: String,
      required: [true, 'A course must have a imageUrl'],
    },
    // isFavorite: {
    //   type: Boolean,
    //   default: false,
    // },
    lessonCount: {
      type: String,
      // required: [true, 'A course must have a lessonCount'],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A course must have a price'],
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    status: {
      type: String,
      default: 'pending',
      emun: ['pending', 'finish'],
    },
    title: {
      type: String,
      required: [true, 'A course must have a name'],
      unique: true,
    },
    tag: [
      {
        type: {
          type: String,
          default: 'SOLD',
          enum: ['SOLD', 'SNNU'],
        },
      },
    ],
    chapters: [
      {
        editFlag: Boolean,
        chapterName: String,
        chapterIndex: Number,
        chapterDuration: Number,
        lessons: [
          {
            editFlag: Boolean,
            lessonName: String,
            lessonIndex: Number,
            lessonDuration: Number,
            lessonParentDuration: Number,
            resources: [
              {
                type: mongoose.Schema.ObjectId,
                ref: 'Resource',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual populate
courseSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'course',
  localField: '_id',
});

// virtual populate
// courseSchema.virtual('registedUsers', {
//   type: 'ObjectId',
//   ref: 'User',
//   foreignField: 'buyCourses',
//   localField: '_id',
//   justOne: true,
// });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;

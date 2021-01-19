const mongoose = require("mongoose");
const uuid = require("uuid");
const User = require("./userModel");
const resourceSchema = new mongoose.Schema(
  {
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
      enum: [
        "mp4",
        "pdf",
        "doc",
        "jpeg",
        "jpg",
        "png",
        "docx",
        "zip",
        "ppt",
        "pptx",
      ],
    },
    tags: {
      // select: false,
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
    },
    org_name: {
      type: String,
      //ref: 'Org',
    },
    subOrg_name: {
      type: String,
      //ref: 'SubOrg',
    },
    major_name: {
      type: String,
      //ref: 'Major',
    },
  },
  { _id: false }
);
resourceSchema.post('save', async function (doc) {
  const data = await User.findById(doc.authorId).select('org_name subOrg_name major_name')
  if(data != null){
    await Resource.updateOne(
      { _id: doc._id},
      { $set: { org_name: data.org_name,subOrg_name:data.subOrg_name,major_name:data.major_name }
    })
  }
});
const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;

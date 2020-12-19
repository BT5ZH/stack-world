const mongoose = require("mongoose");
const uuid = require("uuid");

var courseSchema = mongoose.Schema(
  {
    _id: {
        type: String,
        required: [true,'you must tell us your _id'],
        default:uuid.v1,
    },
    course_id:{
      type: String,
      required: [true, "you must tell us your course_id"]
    },
    name: {
      type: String,
      required: [true, "you must tell us your course_name"]
    },
    org_name: {
      type: String
      //ref: 'Org',
    },
    subOrg_name: {
      type: String
      //ref: 'SubOrg',
    },
    major_name: {
      type: String
      //ref: 'Major',
    }
  },
  { _id: false }
);

var Course = mongoose.model("Course", courseSchema);

module.exports = Course; //暴露模块

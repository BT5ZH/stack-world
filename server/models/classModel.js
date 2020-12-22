const mongoose = require("mongoose");
const uuid = require("uuid");

const classSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true,'you must tell us your class_id'],
      default:uuid.v1,
    },
    class_name: {
      type: String,
      default: "专业名-20XX级-1班 ",
      required: [true, "class must have an className"],
      unique: true,
    },
    org_name: {  type: String,},
    subOrg_name:{  type: String,},
    major_name: {  type: String,},
    students: [
        {
          type: String,
          ref: 'User',
        },
    ],
   },
   {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
   },
   {_id: false,}
  );
   
  classSchema.virtual('studentList', {
    ref: 'User',
    localField: 'students',
    //foreignField: 'bookId',
    foreignField: '_id',
    justOne: false,
});
const Class = mongoose.model("Class", classSchema);

module.exports = Class;

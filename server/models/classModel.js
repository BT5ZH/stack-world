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
    students: [
        {
          type: mongoose.Schema.Types.String,//type: mongoose.Schema.Types.ObjectID,
          ref: 'User',
          //studentID: { type: String },
          // studentName: { type: String, required: true },
          // remark: { type: String, default: "remark" },
        },
    ],
      //   validate: (o) => Array.isArray(o) && o.length > 0,
    
      org_name: {  
        type: String,
      },
      subOrg_name:{ 
        type: String,
      },
      major_name: {  
        type: String,
      },
   },{_id:false}
  );
    // tags: {
    //   type: [String],
    //   //   validate: (o) => Array.isArray(o) && o.length > 0,
    // },
    // staff: {
    //   manager: { type: String, required: true },
    // },
    
//     curriculum: {
//       type: [
//         {
//           courseID: { type: String, required: true },
//           courseName: { type: String, required: true },
//           courseStartYear: { type: Date, required: true },
//           courseSemaster: {
//             type: String,
//             required: true,
//             enum: ["spring", "autumn"],
//           },
//           courseDuration: { type: Number, required: true },
//           timeTable: {
//             type: [
//               {
//                 date: {
//                   type: String,
//                   required: true,
//                   enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//                 },
//                 order: { type: [Number] },
//                 location: { type: String, required: true },
//               },
//             ],
//           },
//         },
//       ],
//     },
//     enrollmentTime: {
//       type: Date,
//     },
//     graduateTime: {
//       type: Date,
//     },
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
 // );

const Class = mongoose.model("Class", classSchema);

module.exports = Class;

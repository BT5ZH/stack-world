const mongoose = require("mongoose");
const uuid = require("uuid");

const studentpaperSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: [true, "Please tell us the ID"],
    default: uuid.v1
  },
  student_id:{
    type: mongoose.Schema.Types.String,
    ref: 'User',
  },
  paper_id:{
        type: mongoose.Schema.Types.String,
        ref: "Paper",
  },
  is_finished:{
        type:Boolean,
        default:false,
  },
  questions: [
   {
            ques_id:{
              type: mongoose.Schema.Types.String,
              ref:"Question",
            },
            stem:{
              type: String,
            },
            options:[
              {
                type: String,
              }
            ],
            student_answer:{
              type: String,
              default:'Z',
            },
            right_answer:{
              type: String,
            }
   },
  ],
  score:{
          type:Number,
          default:0,
  },
  begin_time: {
        type: String,
     
  },
  submit_time: {
        type: String,
  },
});
studentpaperSchema.index({ student_id: 1, paper_id: 1}, { unique: true });// I'd like setting composite primary key 

const Studentpaper = mongoose.model("Studentpaper", studentpaperSchema);

module.exports = Studentpaper;

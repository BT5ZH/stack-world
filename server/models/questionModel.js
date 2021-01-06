const mongoose = require("mongoose");
const uuid = require("uuid");

const questionSchema = new mongoose.Schema({
    _id:{
        type:String,
        required: [true, "Please tell us question's ID"],
        default:uuid.v1,

    },
    lesson_id:{
        type: String,
        ref:"Lesson"
    },
    teacher_id:{
        type: String,

    },
    statement: {
        stem:{
            type: String,
            required: [true, "Please tell us the question's statement."],
        },
        options: [  
            {
               type:String,
            },
        ],
        right_answer:{
            type:String,
            required: [true, "Please tell us the answer."],
        }
    },
    stem_type:{//题干的类型（如果题干是文件类的，stem存的是文件的地址，如果是文字类的直接存文字
        type:String,
    },
    question_type:{//题型（单选2\多选3\主观1)
        type:Number,
    },
    analysis: {
        type: String,
    },
    knowlege: {//知识点
        type: String,
    },
    grade: {//难度
        type: Number,
        default:2,    
    },
    key_word:{//关键词
        type:String
    }
    
},{_id:false});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;

const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    activity_id: {
      type: String,
      required: [true, "activity must have an activity_id"],
    },
    activity_index: {
      type: Number,
      required: [true, "activity must have an activity_index"],
    },
    activity_location: {
      type: String,
      required: [true, "activity must have an activity_location"],
    },
    activity_location_id: {
      type: String,
      required: [true, "activity must have an activity_location_id"],
    },
    // activity_status: {
    //   type: String,
    //   enum: ["preparing", "running", "finished"],
    // },
    start_time: {
      type: Date,
      default: Date.now(),
    },
    end_time: {
      type: Date,
    },
    org_name: { type: String, required: true },
    sub_org_name: { type: String, required: true },
    teacher_name: { type: String, required: true },
    phases: {
      type: [
        {
          phase_time: { type: Number },
          // 此处不需要枚举，因为存储内容在前端限制了。如果枚举以后添加活动麻烦
          phase_type: { type: String }, //暂时不添加枚举
        },
      ],
    },
    // 抢答
    race_data: [
      {
        // 抢答学生的信息
        race_students: [
          {
            studentID: String,
            studentName: String,
            student_answer: String,
          },
        ],
        // 问题信息
        race_question: {
          title: String,
          options: [
            {
              text: String,
              value: String,
            },
          ],
          question_type: Number,
          right_answer: String,
        },
      },
    ],
    //随机点名
    randomSign_data: [
      {
        studentID: String,
        studentName: String,
        signStatus: String,
      },
    ],
    sign_data: {
      type: [
        {
          total_number: { type: Number },
          real_number: { type: Number },
          class_name: { type: String },
          class_id: { type: String },
          class_list: {
            type: [
              {
                _id: { type: String },
                studentId: { type: String },
                studentName: { type: String },
                enterTime: { type: String }, // 需要改成日期类型
                signStatus: { type: String },
                role: { type: String },
                joinFlag: { type: Boolean },
              },
            ],
          },
        },
      ],
    },
    // 提问
    question_data: {
      type: [
        {
          total_number: { type: Number },
          real_number: { type: Number },
          class_name: { type: String },
          class_id: { type: String },
          question_answer_list: {
            type: [
              {
                questionId: { type: String },
                studentId: { type: String },
                studentName: { type: String },
                answerTime: { type: String }, // 需要改成日期类型
                answerSelection: { type: String },
                answerResult: { type: Boolean },
                joinFlag: { type: Boolean },
              },
            ],
          },
        },
      ],
    },
    // 投票
    vote_data: {
      type: [
        {
          total_number: { type: Number },
          real_number: { type: Number },
          class_name: { type: String },
          class_id: { type: String },
          vote_list: {
            type: [
              {
                studentId: { type: String },
                studentName: { type: String },
                submitTime: { type: String }, // 需要改成日期类型
                joinFlag: { type: Boolean },
                phaseIndex: { type: Number },
                result_list: {
                  type: [
                    {
                      voteSelection: { type: String },
                      voteIndex: { type: Number },
                      voteItemId: { type: String },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
    // 随堂测试
    test_data: {
      type: [
        {
          total_number: { type: Number },
          real_number: { type: Number },
          class_name: { type: String },
          class_id: { type: String },
          test_list: {
            type: [
              {
                studentId: { type: String },
                studentName: { type: String },
                submitTime: { type: String }, // 需要改成日期类型
                joinFlag: { type: Boolean },
                phaseIndex: { type: Number },
                result_list: {
                  type: [
                    {
                      testSelection: { type: String },
                      testIndex: { type: Number },
                      testItemId: { type: String },
                      answerResult: { type: Boolean },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
    // 文件下发
    file_data: {
      type: [
        {
          total_number: { type: Number },
          real_number: { type: Number },
          class_name: { type: String },
          class_id: { type: String },
          result_list: {
            type: [
              {
                fileId: { type: String },
                fileUrl: { type: String },
                fileName: { type: String },
              },
            ],
          },
        },
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;

import axios from "@/utils/axios";

const dateMap = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const colorItems = [
  "#9FE6B8",
  "#FFDB5C",
  "#ff9f7f",
  "#fb7293",
  "#8378EA",
  "#96BFFF",
  "#e7bcf3",
  "#9d96f5",
  "#f56a00",
  "#7265e6",
  "#ffbf00",
  "#00a2ae",
];

function errorHandler(data, funcName) {
  if (data.status !== "success") {
    throw `[vuex-student-action] response status of '${funcName}' is not success`;
  }
}

function dateTransform(value) {
  let index = dateMap.findIndex((item) => {
    return value === item;
  });
  return index + 1;
}

const action = {
  async changeUserInfo({ state }, obj) {
    const url = "/pc/v1/users/" + state.user.id;
    const { data } = await axios.patch(url, obj);
    errorHandler(data, "changeUserInfo");
    return data.status;
  },

  async getCourseList({ commit }, timeData) {
    const url = "/pc/v1/timetables/getTimeTableFromStudentID";
    const { data } = await axios.post(url, timeData);
    errorHandler(data, "getCourseList");
    let courseList = data.data.result;
    if (courseList.length != 0) {
      courseList = courseList.map((item, index) => ({
        lesson_id: item.lesson_id,
        course_id: item.course_id._id,
        course_name: item.course_id.name,
        teacher: item.teacher_id.name,
        style: {
          backgroundColor: colorItems[index],
          borderColor: colorItems[index],
        },
        curriculum: item.curriculum.map((obj) => ({
          week: dateTransform(obj.date),
          odd:
            obj.odd_or_even == 0
              ? "单双周"
              : obj.odd_or_even == 1
              ? "单周"
              : "双周",
          time:
            "第" +
            obj.order[0] +
            "-" +
            obj.order[obj.order.length - 1] +
            "节课",
          classroom: obj.room_id.building_name + obj.room_id.room_number,
        })),
      }));
    }

    commit("updateCourseList", courseList);
  },

  async getCourseInfo({ commit }, id) {
    const url = "/pc/v1/lessons/" + id;
    const { data } = await axios.get(url);
    errorHandler(data, "getCourseInfo");
    // console.log(data);
    const courseList = data.data;
    // .organizations.map((item) => ({
    //   courseName: item.organizationName,
    //   desc: item.organizationDescription,
    //   sid: item._id,
    // }));
    // commit("updateCourseList", courseList);
  },

  async getResList({ commit }, id) {
    const { data } = await axios.get("/pc/v1/resources?lesson_id=" + id);
    errorHandler(data, "getResList");
    // console.log(data);
    const resList = data.resources;
    // .map((item) => ({
    //   resName: item.organizationName,
    //   desc: item.organizationDescription,
    //   sid: item._id,
    // }));
    commit("updateResList", resList);
  },
  async getHomeworkList({ commit }, { lesson_id, student_id }) {
    const postData = { lesson_id, student_id };
    const { data } = await axios.post(
      "/pc/v1/sethomeworks/getSetAndSubmitHomeworkForStuByLessonID",
      postData
    );
    errorHandler(data, "getHomeworkList");
    // console.log(data.Homeworks)
    let homeworkList = data.homeworkList;
    let resList = data.resList;
    // if (homeworkList.length != 0) {
    // homeworkList = homeworkList.map((item) => ({
    //   hid: item._id,
    //   lid: item.lesson_id._id,
    //   cid: item.lesson_id.course_id._id,
    //   isFinish:false,
    //   resType:0,
    //   title: '第'+item.number_of_time+'课作业',
    //   content: item.content,
    //   attachment_url: item.attachment_url,
    // }));
    commit("updateHomeworkList", homeworkList);
    commit("updateResList", resList);
    //}
  },
  async getExamList({ commit }, { lesson_id, student_id }) {
    const postData = { lesson_id, student_id };
    const { data } = await axios.post(
      "/pc/v1/questions/paper/getExamInfoForStuByLessonID",
      postData
    );
    errorHandler(data, "getExamList");
    // console.log(data.Homeworks)
    let examList = data.examList.map((item)=>{
      return{
        id:item.id,
        lid:item.lid,
        isFinish:item.isFinish,
        resType:0,
        title:item.title,
        task_type:item.task_type,
        deadline:item.deadline,
        score:item.score,
        quesitons:item.questions.map((n)=>{
          let options=[]
          var num = 65;//"A"的ASCII值
          
          for(let i=0;i<n.options.length;i++){
              let value=String.fromCharCode(num+i); 
              let text=n.options[i]
              options.push({value,text})
          }
          return{
            content:n.stem,
            options:options,
            answer:n.right_answer.split(""),
            student_answer:n.student_answer
          }
        })
      }
    });
    commit("updateExamList", examList);

     // {
    //   id: "b8e0ac50-000",
    //   isFinish: false,
    //   resType: 0,
    //   title: "examination 1",
    //   task_type: "exam",
    //   deadline: "2021-02-19 14:02",
    //   score: 0,
    //   questions: [
    //     {
    //       content: "question 1",
    //       options: [
    //         { value: "A", text: "aaaaa" },
    //         { value: "B", text: "bbbbb" },
    //         { value: "C", text: "ccccc" },
    //         { value: "D", text: "ddddd" },
    //       ],
    //       answer: ["A"],
    //     },
    //     {
    //       content: "question 2",
    //       options: [
    //         { value: "A", text: "aaaaa" },
    //         { value: "B", text: "bbbbb" },
    //         { value: "C", text: "ccccc" },
    //         { value: "D", text: "ddddd" },
    //         { value: "E", text: "eeeee" },
    //       ],
    //       answer: ["A", "E"],
    //     },
    //   ],
    // },
  },
  async getFavResList({ commit }) {
    const { data } = await axios.get("/pc/v1/organizations");
    errorHandler(data, "getFavResList");
    const favResList = data.data.organizations.map((item) => ({
      resName: item.organizationName,
      desc: item.organizationDescription,
      sid: item._id,
    }));
    commit("updateResList", favResList);
  },
};

export default action;

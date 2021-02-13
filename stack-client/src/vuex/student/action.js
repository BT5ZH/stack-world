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

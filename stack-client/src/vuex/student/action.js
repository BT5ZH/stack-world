import axios from "@/utils/axios";

function errorHandler(data, funcName) {
  if (data.status !== "success") {
    throw `[vuex-super-action] response status of '${funcName}' is not success`;
  }
}

const action = {

  async changeUserInfo({ state },obj) {
    const url ='/pc/v1/users/'+ state.user.id
    const { data } = await axios.patch(url,obj);
    errorHandler(data, "changeUserInfo");
    console.log(data)
    return data.status;
  },

  async getCourseList({ commit },timeData) {
    const url ='/pc/v1/timetable/getTimeTableFromStudentID'
    const { data } = await axios.post(url,timeData);
    errorHandler(data, "getCourseList");
    console.log(data)
    const courseList = data.data
    // .organizations.map((item) => ({
    //   courseName: item.organizationName,
    //   desc: item.organizationDescription,
    //   sid: item._id,
    // }));
    commit("updateCourseList", courseList);
  },
  async getResList({ commit }) {
    const { data } = await axios.get("/pc/v1/resources?course_id=");
    errorHandler(data, "getResList");
    const resList = data.data.organizations.map((item) => ({
      resName: item.organizationName,
      desc: item.organizationDescription,
      sid: item._id,
    }));
    commit("updateResList", resList);
  },
  async getHomeworkList({ commit }) {
    const { data } = await axios.get("/pc/v1/");
    errorHandler(data, "getHomeworkList");
    const homeworkList = data.data.homeworkList.map((item) => {
      console.log(item);
    });
    commit("updateHomeworkList", homeworkList);
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
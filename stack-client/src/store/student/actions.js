import axios from "../../../utils/axios";

function errorHandler(data, funcName) {
  if (data.status !== "success") {
    throw `[vuex-super-action] response status of '${funcName}' is not success`;
  }
}

const action = {
  async getCourseList({ commit }) {
    const { data } = await axios.get("/pc/v1/organizations");
    errorHandler(data, "getCourseList");
    const courseList = data.data.organizations.map((item) => ({
      courseName: item.organizationName,
      desc: item.organizationDescription,
      sid: item._id,
    }));
    commit("updateCourseList", courseList);
  },
  async getResList({ commit }) {
    const { data } = await axios.get("/pc/v1/organizations");
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
    const resList = data.data.organizations.map((item) => ({
      resName: item.organizationName,
      desc: item.organizationDescription,
      sid: item._id,
    }));
    commit("updateResList", favResList);
  },
};

export default action;
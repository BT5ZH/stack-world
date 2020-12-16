import axios from "../../../utils/axios";

function errorHandler(data, funcName) {
  if (data.status !== "success") {
    throw `[vuex-super-action] response status of '${funcName}' is not success`;
  }
}

const action = {
  async getSchoolList({ commit }) {
    const { data } = await axios.get("/pc/v1/organizations");
    errorHandler(data, "getSchoolList");
    const schoolList = data.data.organizations.map((item) => ({
      schoolName: item.organizationName,
      desc: item.organizationDescription,
      sid: item._id,
    }));
    commit("updateSchoolList", schoolList);
  },
  async getAdminList({ commit }) {
    const { data } = await axios.get("/pc/v1/");
    errorHandler(data, "getAdminList");
    const adminList = data.data.adminList.map((item) => {
      console.log(item);
    });
    commit("updateAdminList", adminList);
    // TODO updateAdminList
  },
};

export default action;
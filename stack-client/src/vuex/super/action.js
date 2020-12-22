import axios from "@/utils/axios";

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
      schoolEnName: item.organizationNameEn,
      desc: item.organizationDescription,
      sid: item._id,
    }));
    commit("updateSchoolList", schoolList);
  },
  async getAdminList({ commit }, org_name) {
    const params = { role: "orgAdmin", org_name };
    const { data } = await axios.get("/pc/v1/users/allOrgAdmin", { params });
    errorHandler(data, "getAdminList");
    commit("updateAdminList", data.teachers);
  },
};

export default action;

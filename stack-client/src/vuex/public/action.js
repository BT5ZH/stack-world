import axios from "@/utils/axios";

const action = {
  addPublicListener({ commit, state }) {
      
  },
  async getOrgnizationName({ commit }, org_id) {
    try {
      const url = "pc/v1/organizations";
      //const requestData = { org_id };
      const { data } = await axios.get(`${url}/${org_id}`);
      commit("updateOrganizationName", data.data.organization.organizationName);
    } catch (error) {
      console.error(error);
    }
  },
};

export default action;

import axios from "@/utils/axios";

const action = {
  async change_spin_status({ commit }, status) {
    commit("change_spin_status", status);
  },
  async change_Tree_spin_status({ commit }, status) {
    commit("change_Tree_spin_status", status);
  },
  getResourcesOfOneCollege({ commit }, { org_name, subOrg_name }) {
    return new Promise((resolve, reject) => {
      const requestData = { org_name, subOrg_name };
      const url = "/pc/v1/resources/getLessonResourceOfSubOrg";
      axios
        .post(url, requestData)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject("error-----");
        });
    });
  },
  getAllResources({ commit }) {
    return new Promise((resolve, reject) => {
      const url = "/pc/v1/resources";
      axios
        .get(url)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deleteResourceById({ commit }, resource_id) {
    return new Promise((resolve, reject) => {
      const url = "/pc/v1/resources";

      axios
        .delete(`${url}/${resource_id}`)
        .then(() => {
          resolve("success");
        })
        .catch((err) => {
          reject("error-----");
        });
    });
  },
  getTreeByURLwithSpin({ commit }, url) {
    // 显示loading
    commit("change_spin_status", true);

    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((response) => {
          resolve(response);
          commit("change_spin_status", false);
        })
        .catch((err) => {
          commit("change_spin_status", false);

          reject(err);
        });
    });
  },

  getTreeByURL({ commit }, url) {
    // 显示loading

    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export default action;

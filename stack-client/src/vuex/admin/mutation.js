const mutation = {
  change_Tree_spin_status(state, status) {
    state.Tree_spin_status = status;
  },
  change_spin_status(state, status) {
    state.spin_status = status;
  },
  updateSessionStorage(key, value) {
    if (typeof key === "object") {
      let obj = key;
      Object.keys().forEach((item) => {
        sessionStorage.setItem(item, obj[item]);
      });
    }
    if (typeof key === "string") {
      sessionStorage.setItem(key, value);
    }
  },
  changeState(state, params) {
    state.temp = params;
  },
  getClassTable(state, payload) {
    state.classTable = payload;
  },
  getSchoolInfo(state, payload) {
    state.schoolInfo = payload;
  },
  getSubOrgId(state, payload) {
    for (let item of state.schoolInfo) {
      if (item.subOrgName === payload) {
        state.subOrgId = item._id;
      }
    }
  },
  clearStorage(state) {
    Object.keys(state).forEach((key) => {
      if (Array.isArray(state[key])) {
        state[key] = [];
      } else if (typeof state[key] === "object") {
        state[key] = {};
      } else if (typeof state[key] === "number") {
        state[key] = 0;
      } else if (typeof state[key] === "boolean") {
        state[key] = false;
      } else if (typeof state[key] === "string") {
        state[key] = "";
      }
    });
  },
};

export default mutation;

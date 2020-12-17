const mutation = {
  updateSchoolList(state, params) {
    if (Array.isArray(params)) {
      state.schoolList = params;
      return null;
    }
    throw "[vuex-super-mutation] schoolList type error!";
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

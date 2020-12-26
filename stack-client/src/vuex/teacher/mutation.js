const mutation = {
  updateCourseCalendar(state, params) {
    state.courseCalendar = params;
  },
  updateToday(state, params) {
    state.today = params;
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
  updateSignResult(state, params) {
    if (params) {
      state.signList.push(params);
    }
  },
};

export default mutation;

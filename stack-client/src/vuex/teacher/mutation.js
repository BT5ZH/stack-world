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
  updateTestResult(state, params) {
    const { id, answer } = params;
    if (!state.testAnswerList[id]) {
      state.testAnswerList[id] = { [answer]: 1 };
      return null;
    }
    let corrAnswer = state.testAnswerList[id][answer];
    if (typeof corrAnswer === "number") {
      corrAnswer += 1;
    } else {
      corrAnswer = 1;
    }
  },
  updateTeacherCourses(state, params) {
    state.courses = params;
  },
};

export default mutation;

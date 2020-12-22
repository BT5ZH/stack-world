const mutation = {
  updateUserInfo(state, params) {
    state.user = params;
  },

  updateCourseList(state, params) {
    if (Array.isArray(params)) {
      state.courseList = params;
      return null;
    }
    throw "[vuex-student-mutation] courseList type error!";
  },
  updateResList(state, params) {
    if (Array.isArray(params)) {
      state.resList = params;
      return null;
    }
    throw "[vuex-student-mutation] resList type error!";
  },
  updateHomeworkList(state, params) {
    if (Array.isArray(params)) {
      state.homeworkList = params;
      return null;
    }
    throw "[vuex-student-mutation] homeworkList type error!";
  },
  updateFavResList(state, params) {
    if (Array.isArray(params)) {
      state.favResList = params;
      return null;
    }
    throw "[vuex-student-mutation] favResList type error!";
  },
  updateCourseSignFlag(state) {
    state.courseSign = !state.courseSign;
  },
};

export default mutation;

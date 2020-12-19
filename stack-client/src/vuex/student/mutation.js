const mutation = {
  updateUserInfo(state, params) {
    state.user = params; 
  },

  updateCourseList(state, params) {
    if (Array.isArray(params)) {
      state.courseList = params;
      return null;
    }
    throw "[vuex-super-mutation] courseList type error!";
  },
  updateResList(state, params) {
    if (Array.isArray(params)) {
      state.resList = params;
      return null;
    }
    throw "[vuex-super-mutation] resList type error!";
  },
  updateHomeworkList(state, params) {
    if (Array.isArray(params)) {
      state.homeworkList = params;
      return null;
    }
    throw "[vuex-super-mutation] homeworkList type error!";
  },
  updateFavResList(state, params) {
    if (Array.isArray(params)) {
      state.favResList = params;
      return null;
    }
    throw "[vuex-super-mutation] favResList type error!";
  },
};

export default mutation;

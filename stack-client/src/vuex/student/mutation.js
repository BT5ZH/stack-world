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
  updateOpenRooms(state, { action, roomId }) {
    if (action === "add") {
      state.openRooms.push(roomId);
    } else {
      state.openRooms.splice(state.openRooms.indexOf(roomId), 1);
    }
  },
  updateInteraction(state, { name, params }) {
    if (!state.interaction[name]) {
      console.error("[vuex-student-mutation] invalid interaction name");
      return null;
    }
    if (name == "ask" || name == "randomSign") {
      state.interaction[name] = params
    } else {
      state.interaction[name] = { ...state.interaction[name], ...params };
    }
  },
};

export default mutation;

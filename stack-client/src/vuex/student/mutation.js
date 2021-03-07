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
  updateExamList(state, params) {
    if (Array.isArray(params)) {
      state.examList = params;
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
  updateStudentBadge(state,params){
    console.log("🚀 ~ file: mutation.js ~ line 75 ~ updateStudentBadge ~ params", params)
    console.log("come badge");
    state.classMenu.forEach(menu=>{
      if(menu.route == params.event){
        if(menu.badge ==undefined){
          menu.badge = false;
        }
        menu.badge = params.status;
        console.log("🚀 ~ file: mutation.js ~ line 82 ~ updateStudentBadge ~ menu", menu)
      }
    })
  },
};

export default mutation;

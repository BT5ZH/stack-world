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
  updaterandimSignResult(state, params) {
    if (params) {
      state.randomList.push(params);
    }
  },
  updatePickResult(state, params) {
    if (params) {
      state.pick_answer = params;
    }
  },
  updateAskResult(state, params) {
    if (params) {
      if (!state.ask_answer[0]) state.ask_answer = [];
      state.ask_answer.push(params)
    } else {
      console.error("学生端未返回数据");
    }
  },
  updateTestResult(state, params) {
    const { id, answer } = params;
    let quesIndex = state.testAnswerList.findIndex((item) => item.id === id);
    if (quesIndex < 0) {
      state.testAnswerList.push({ id: id, [answer]: 1 });
      return null;
    }
    let ques = state.testAnswerList[quesIndex];
    state.testAnswerList.splice(quesIndex, 1, {
      ...ques,
      [answer]: ques[answer] ? ques[answer] + 1 : 1,
    });
  },
  updateVoteResult(state, params) {
    const { id, answer } = params;
    let quesIndex = state.voteAnswerList.findIndex((item) => item.id === id);
    if (quesIndex < 0) {
      state.voteAnswerList.push({ id: id, [answer]: 1 });
      return null;
    }
    let ques = state.voteAnswerList[quesIndex];
    state.voteAnswerList.splice(quesIndex, 1, {
      ...ques,
      [answer]: ques[answer] ? ques[answer] + 1 : 1,
    });
  },
  updateRaceResult(state, params) {
    state.raceList.push(params);
  },
  updateTeacherCourses(state, params) {
    state.courses = params;
  },
  updateTeacherPrepare(state, params) {
    state.precourse = params;
  },
  updateOnlineList(state, params) {
    state.onlineList = Object.keys(params)
      .filter((item) => {
        return params[item].startsWith("{");
      })
      .map((key) => {
        let info = JSON.parse(params[key]);
        return info;
      });
  },
  clearOnlineList(state) {
    state.onlineList = [];
  },

  setCurActivityID(state, payload) {
    console.log("setCurActivityID mutation :");
    console.log(payload);
    state.curActivityID = payload.curActivityID;
  },

  setCurClass(state, payload) {
    state.curclassId = payload.curclassId;
    state.curclassName = payload.curclassName;
  },

  setRealStudent(state, payload) {
    // 把班级应到学生列表写入STORE
    console.log("把班级应到学生列表写入STORE");
    console.log(payload);
    state.curRealStudents = payload;
  },

  addRandomStudent(state, randomStudent) {
    state.randomStudent = randomStudent;
    if (!state.randomStudents) state.randomStudents = [];
    let singleStudent = {};
    state.curRealStudents.forEach(student => {
      if (student.name === randomStudent) {
        singleStudent.studentName = randomStudent;
        singleStudent.studentID = student.id;
      }
    })
    state.randomStudents.push(singleStudent);
  },
  updateCurActivity(state, params) {
    state.curActivity = params;
  },
  updateCourseHours(state, { _id, one_class }) {
    state.courseHours = one_class;
    state.curLessonId = _id;
    state.nodes = state.courseHours[state.curCourseHour].nodes;
  },
  updateCurCourseHour(state, params) {
    // 在新建课时时，为他的相应信息赋值
    if (state.courseHours[params] === undefined) {
      state.courseHours.push({
        PPT: {},
        description: "",
        duration: 50,
        name: "",
        nodes: [],
      });
    }
    state.curCourseHour = params;
    state.nodes = state.courseHours[params].nodes;
  },
  updateCourseHour(state, params) {
    state.courseHours[state.curCourseHour] = params;
  },
  updateNodeIndex(state, params) {
    state.nodeindex = params;
  },
  addNode(state, params) {
    state.nodes.push(params);
    state.courseHours[state.curCourseHour].nodes = state.nodes;
  },
  updateNode(state, params) {
    state.nodes[state.nodeindex] = params;
    state.courseHours[state.curCourseHour].nodes = state.nodes;
  },
  deleteNode(state, params) {
    state.nodes.splice(params, 1);
    state.courseHours[state.curCourseHour].nodes = state.nodes;
  },
  updateNodevote(state, params) {
    let node = state.nodes[state.nodeindex];
    node.vote = params;
    state.nodes.splice(state.nodeindex, 1, node);
    state.courseHours[state.curCourseHour].nodes = state.nodes;
  },
  updatepeople_num(state, params) {
    state.nodes[state.nodeindex].people_num = params;
    state.courseHours[state.curCourseHour].nodes = state.nodes;
  },
  updateSources(state, params) {
    state.sources = params;
  },
  updatePPT(state, params) {
    state.courseHours[state.curCourseHour].PPT = params;
  },
  updateLessonNames(state, params) {
    state.lessonNames = params.map((item) => item.name);
  },
  updateSetHomeworks(state, params) {
    state.updateSetHomeworks = params;
  },
  updatePapers(state, params) {
    state.updatePapers = params;
  },
  updateQuesOfPaper(state, params) {
    state.questionOfPaper = params;
  },
  updatequestionBank(state, params) {
    state.questionBank = params;
  },
  updateCourseInfo(state, params) {
    state.courseInfo = params;
  },
  updateCourseHourInfo(state, { time, description }) {
    state.courseHours[state.curCourseHour].duration = time;
    state.courseHours[state.curCourseHour].description = description;
  },
};

export default mutation;

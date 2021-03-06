const mutation = {
  updateCourseCalendar(state, params) {
    state.courseCalendar = params;
  },
  updateToday(state, params) {
    state.today = params;
  },
  clearActivity(state) {
    state.testRefresh = 0;
    state.testAnswerList.length = 0;
    state.testShowList.length = 0;
    state.voteRefresh = 0;
    state.voteAnswerList.length = 0;
    state.voteShowList.length = 0;
    state.raceList = [];
    state.randomStudents = [];
    state.randomStudent = "";
    state.ask_answer = [];
    state.randomList = [];
    state.signList = [];
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
    console.log("学生端返回的数据是");
    if (params) {
      if (!state.ask_answer[0]) state.ask_answer = [];
      var repeatStatus = false;
      state.ask_answer.forEach((item) => {
        if (item.studentId === params.studentId) {
          repeatStatus = true;
          item.answerSelection = params.answerSelection;
        }
      });
      if (repeatStatus) {
        return;
      } else {
        state.ask_answer.push(params);
      }
    } else {
      console.error("学生端未返回数据");
    }
  },
  updateFileResult(state, params) {
    console.log("学生端返回的  文件下发  数据是");
    if (params) {
      if (!state.fileAnswerList) state.fileAnswerList = [];
      var repeatStatus = false;
      state.fileAnswerList.forEach((item) => {
        if (item.studentId === params.studentId) {
          repeatStatus = true;
          // item.answerSelection = params.answerSelection;
        }
      });
      if (repeatStatus) {
        console.log("该学生已经提交过文件下发数据，不再接收新的数据");
        // return;
      } else {
        state.fileAnswerList.push(params);
      }
    } else {
      console.error("学生端未返回数据");
    }
  },
  updateTestResult(state, params) {
    console.log("学生端返回的  随堂测试  数据是");
    if (params) {
      if (!state.testAnswerList) state.testAnswerList = [];
      var repeatStatus = false;
      state.testAnswerList.forEach((item) => {
        if (item.studentId === params.studentId) {
          repeatStatus = true;
          // item.answerSelection = params.answerSelection;
        }
      });
      if (repeatStatus) {
        console.log("该学生已经提交过测试结果，不再接收新的测试");
        // return;
      } else {
        state.testAnswerList.push(params);
      }
    } else {
      console.error("学生端未返回数据");
    }

    console.log("用于显示统计结果数据");
    const {
      studentId,
      studentName,
      submitTime,
      result_list,
      phaseIndex,
    } = params;
    // 统计投票数量
    result_list.forEach((result) => {
      state.testShowList[result.testIndex].yArr[result.testSelection]++;
      state.testShowList[result.testIndex].itemId = result.testItemId;
    });

    // 投票状态
    if (state.testRefresh == undefined) state.testRefresh = 0;
    else state.testRefresh++;
    // const { id, answer } = params;
    // let quesIndex = state.testAnswerList.findIndex((item) => item.id === id);
    // if (quesIndex < 0) {
    //   state.testAnswerList.push({ id: id, [answer]: 1 });
    //   return null;
    // }
    // let ques = state.testAnswerList[quesIndex];
    // state.testAnswerList.splice(quesIndex, 1, {
    //   ...ques,
    //   [answer]: ques[answer] ? ques[answer] + 1 : 1,
    // });
  },

  updateVoteResult(state, params) {
    console.log("学生端返回的  投票  数据是");
    if (params) {
      if (!state.voteAnswerList) state.voteAnswerList = [];
      var repeatStatus = false;
      state.voteAnswerList.forEach((item) => {
        if (item.studentId === params.studentId) {
          repeatStatus = true;
          // item.answerSelection = params.answerSelection;
        }
      });
      if (repeatStatus) {
        console.log("该学院已经提交过投票，不再接收新的投票");
        return;
      } else {
        state.voteAnswerList.push(params);
      }
    } else {
      console.error("学生端未返回数据");
    }

    console.log("用于显示统计结果数据");
    const {
      studentId,
      studentName,
      submitTime,
      result_list,
      phaseIndex,
    } = params;
    // 统计投票数量
    result_list.forEach((result) => {
      state.voteShowList[result.voteIndex].yArr[result.voteSelection]++;
      state.voteShowList[result.voteIndex].itemId = result.voteItemId;
    });

    // 投票状态
    if (state.voteRefresh == undefined) state.voteRefresh = 0;
    else state.voteRefresh++;
  },
  updateVoteShowList(state, payload) {
    state.voteShowList = payload;
  },
  updateTestShowList(state, payload) {
    state.testShowList = payload;
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
    state.curRealStudents.forEach((student) => {
      if (student.name === randomStudent) {
        singleStudent.studentName = randomStudent;
        singleStudent.studentID = student.id;
      }
    });
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
  updateNodeContents(state, params) {
    let node = state.nodes[state.nodeindex];
    node.node_contents = params;
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

const getter = {
  todayCourses(state) {
    const len = state.courseCalendar.length;
    const todayEn = state.today.title;
    let todayCourses = [];
    for (let i = 0; i < len; i++) {
      let {
        courseName,
        teacherName,
        lessonId,
        curriculum,
      } = state.courseCalendar[i];
      curriculum.forEach((rc) => {
        if (rc.date === todayEn) {
          let obj = {
            courseName,
            teacherName,
            lessonId,
            className: rc.class_id.class_name,
            roomName: rc.room_id.room_number,
            date: rc.date,
            oddEven: rc.odd_or_even,
            order: rc.order.join("、"),
          };
          todayCourses.push(obj);
        }
      });
    }
    return todayCourses.sort(
      (a, b) => a.order.substring(0, 1) - b.order.substring(0, 1)
    );
  },
  weekBadages(state) {
    const len = state.courseCalendar.length;
    const weekTable = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let weekBadages = weekTable.reduce((result, item) => {
      result[item] = false;
      return result;
    }, {});
    for (let i = 0; i < len; i++) {
      let { curriculum } = state.courseCalendar[i];
      curriculum.forEach((rc) => {
        weekBadages[rc.date] = true;
      });
    }
    return weekBadages;
  },
  courseHours(state) {
    return state.courseHours.map((item) => item.name);
  },
  curCourseHour(state) {
    return state.courseHours[state.curCourseHour];
  },
  curNode(state) {
    return state.nodes[state.nodeindex];
  },
  getVote(state) {
    return state.nodes[state.nodeindex].vote.map((item) => ({
      title: item.title,
      options: item.options,
    }));
  },
  getCompete(state) {
    const vote = state.nodes[state.nodeindex].vote[0];
    return {
      value: state.nodes[state.nodeindex].people_num,
      title: vote.title,
      options: vote.options,
      ifshow: vote.question_type,
      rightanswer: vote.right_answer,
    };
  },
  getDocument(state) {
    return state.nodes[state.nodeindex].vote[0].options;
  },
  getTest(state) {
    return state.nodes[state.nodeindex].vote.map((item) => item.title);
  },
  getSources(state) {
    return state.sources.map((item) => {
      return {
        courseId: item._id,
        courseName: item.name,
        type: item.rsType,
        url: item.url,
      };
    });
  },
  getPPTSource(state) {
    return state.sources
      .filter((item) => {
        return item.rsType === "ppt" || item.rsType === "pptx";
      })
      .map((item) => ({
        id: item._id,
        url: item.url,
        name: item.name,
      }));
  },
  resourceList(state) {
    return state.sources.map((item) => ({
      sourceId: item._id,
      sourceName: item.name,
      rsType: item.rsType,
      tags: item.tags,
      url: item.url,
    }));
  },
  getQuestionList(state) {
    return state.questionBank
      .filter((item) => item.question_type === 2 || item.question_type === 3)
      .map((question) => {
        return {
          id: question._id,
          stem: question.statement.stem,
          option: question.statement.options,
          answer: question.statement.right_answer,
          multiple: question.question_type !== 2,
          type: question.stem_type,
          knowledge: question.knowlege.split(" "),
          grade: question.grade,
          key_word: question.key_word.split(" "),
          analysis: question.analysis,
        };
      });
  },
};

export default getter;

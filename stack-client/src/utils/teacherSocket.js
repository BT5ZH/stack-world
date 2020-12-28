/**
 * public、joinRoom .etc is channel name
 * classBegin classOver is actionType
 */
let default_listeners = {
  public: {
    classBegin(data, that) {
      let lessonIdList = that.$store.getters.student.lessonIdList;
      const cb = (lesson) => data.lessonId === lesson;
      const condition = lessonIdList.some(cb);
      if (!condition) return null;
      that.$store.commit("student/updateOpenRooms", {
        action: "add",
        roomId: data.lessonId,
      });
    },
    classOver(data, that) {
      let lessonIdList = that.$store.getters.student.lessonIdList;
      const cb = (lesson) => data.lessonId === lesson;
      const condition = lessonIdList.some(cb);
      if (!condition) return null;
      that.$store.commit("updateOpenRooms", {
        action: "delete",
        roomId: data.lessonId,
      });
    },
  },
  joinRoom: {},
};

let lesson_listeners = {
  sign(data, that) {
    that.$store.commit("teacher/updateSignResult", data);
  },
  enter(data, that) {
    console.log("someone join class", data);
  },
  test(data, that) {
    const { id, answer } = data;
    if (!that.testAnswerList[id]) {
      that.testAnswerList[id] = { [answer]: 0 };
    }
    let corrAnswer = that.testAnswerList[id][answer];
    if (typeof corrAnswer === "number") {
      that.testAnswerList[id][answer]++;
    } else {
      that.testAnswerList[id][answer] = 1;
    }
    that.testAnswer();
    // that.$store.commit("teacher/updateTestResult", data);
  },
};

export default function teacherListeners(lessonId) {
  if (!lessonId) return default_listeners;
  default_listeners[lessonId] = lesson_listeners;
  return default_listeners;
}

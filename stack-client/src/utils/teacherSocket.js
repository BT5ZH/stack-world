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
    if (data.role === "teacher") return null;
    that.$store.commit("teacher/updateSignResult", data);
  },
  enter(data, that, rawData) {
    if (data.role === "teacher") return null;
    that.$store.dispatch("teacher/getOnlineStudents", rawData.roomId);
  },
  leave(data, that, rawData) {
    if (data.role === "teacher") return null;
    that.$store.dispatch("teacher/getOnlineStudents", rawData.roomId);
  },
  test(data, that) {
    if (data.role === "teacher") return null;
    that.$store.commit("teacher/updateTestResult", data);
  },
  ask(data, that) {
    console.log("student_data_come-----");
    if (data.role === "teacher") return null;
    that.$store.commit("teacher/updateAskResult", data);
  },
  vote(data, that) {
    if (data.role === "teacher") return null;
    that.$store.commit("teacher/updateVoteResult", data);
  },
  race(data, that) {
    if (data.role === "teacher") return null;
    const curLength = that.$store.state.teacher.raceList.length;
    if (curLength < data.limit) {
      that.$store.commit("teacher/updateRaceResult", data);
      return null;
    }
    // that.sendraceOverEvent();
  },
};

export default function teacherListeners(lessonId) {
  if (!lessonId) return default_listeners;
  default_listeners[lessonId] = lesson_listeners;
  return default_listeners;
}

let default_listeners = {
  public: {
    classBegin(data, that) {
      let lessonIdList = that.$store.getters["student/lessonIdList"];
      const cb = (lesson) => data.lessonId === lesson;
      const condition = lessonIdList.some(cb);
      if (!condition) return null;
      that.$store.commit("student/updateOpenRooms", {
        action: "add",
        roomId: data.lessonId,
      });
    },
    classOver(data, that) {
      let lessonIdList = that.$store.getters["student/lessonIdList"];
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
    console.log("学生收到签到信号");
    that.$store.commit("student/updateInteraction", {
      name: "sign",
      params: { start: true, endTime: Date.now() + 60000 },
    });
  },
  randomSign(data, that) {
    that.$store.commit("student/updateInteraction", {
      name: "randomSign",
      params: {
        start: true,
        endTime: Date.now() + 60000,
        randomStudent: data.studentList,
      },
    });
  },
  pick(data, that) {
    that.$store.commit("student/updateInteraction", {
      name: "test",
      params: {
        questions: data.map((item) => {
          item.content = item.stem;
          item.options = item.options.map((option, index) => ({
            value: String.fromCharCode(65 + index),
            text: option,
          }));
          return item;
        }),
      },
    });
  },
  vote(data, that, eventData) {
    console.log("发送到投票数据");
    console.log(data);
    that.$store.commit("student/updateInteraction", {
      name: "vote",
      params: {
        questions: data.map((item) => {
          item.content = item.stem;
          item.options = item.options.map((option, index) => ({
            value: String.fromCharCode(65 + index),
            text: option,
          }));
          return item;
        }),
        phaseIndex: eventData.phaseIndex,
      },
    });
  },
  enter(data, that) {
    console.log("someone join class", data);
  },
  race(data, that) {
    if (!data.start) {
      let raceData = that.$store.state.student.interaction.race;
      that.$store.commit("student/updateInteraction", {
        name: "race",
        params: { ...raceData, start: false },
      });
      return null;
    }
    data.question.content = data.question.stem;
    data.question.options = data.question.options.map((option, index) => ({
      value: String.fromCharCode(65 + index),
      text: option,
    }));
    that.$store.commit("student/updateInteraction", {
      name: "race",
      params: { ...data },
    });
  },
  file(data, that) {
    that.$store.commit("student/updateInteraction", {
      name: "file",
      params: { fileList: data.fileList },
    });
  },
  ask(data, that) {
    data.question.content = data.question.stem;
    data.question.options = data.question.options.map((option, index) => ({
      value: String.fromCharCode(65 + index),
      text: option,
    }));
    that.$store.commit("student/updateInteraction", {
      name: "ask",
      params: { ...data },
    });
  },
};

export default function studentListeners(lessonId) {
  if (!lessonId) return default_listeners;
  default_listeners[lessonId] = lesson_listeners;
  return default_listeners;
}

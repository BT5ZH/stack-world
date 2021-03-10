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
  sign(data, that, eventData) {
    console.log("🚀 ~ file: studentSocket.js ~ line 29 ~ sign ~ eventData", eventData)
    // 只接受老师的发布
    if (eventData.role == "teacher") {
      console.log("学生收到签到信号");
      that.$store.commit("student/updateInteraction", {
        name: "sign",
        params: { start: true, endTime: Date.now() + 60000 },
      });
      // 通知学生,开启事件徽标
      that.$store.commit("student/updateStudentBadge", { event: "sign", status: true })
    }
  },
  randomSign(data, that, eventData) {
    if (eventData.role == "teacher") {
      that.$store.commit("student/updateInteraction", {
        name: "randomSign",
        params: {
          start: true,
          endTime: Date.now() + 60000,
          randomStudent: data.studentList,
        },
      });
      // 通知学生,开启事件徽标
      that.$store.commit("student/updateStudentBadge", { event: "random", status: true })
    }
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
    if (eventData.role == "teacher") {
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
      that.$store.commit("student/updateStudentBadge", { event: "vote", status: true })
    }
  },
  enter(data, that) {
    console.log("someone join class", data);
  },
  race(data, that, eventData) {
    if (eventData.role == "teacher") {
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
      that.$store.commit("student/updateStudentBadge", { event: "race", status: true })
    }
  },
  file(data, that) {
    that.$store.commit("student/updateInteraction", {
      name: "file",
      params: { fileList: data.fileList },
    });
  },
  ask(data, that, eventData) {
    if (eventData.role == "teacher") {
      data.question.content = data.question.stem;
      data.question.options = data.question.options.map((option, index) => ({
        value: String.fromCharCode(65 + index),
        text: option,
      }));
      that.$store.commit("student/updateInteraction", {
        name: "ask",
        params: { ...data },
      });
      that.$store.commit("student/updateStudentBadge", { event: "test", status: true })
    }
  },
  test(data, that, eventData) {
    console.log("发送到隋唐测试数据");
    console.log(data);
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
        phaseIndex: eventData.phaseIndex,
      },
    });
  },
};

export default function studentListeners(lessonId) {
  if (!lessonId) return default_listeners;
  default_listeners[lessonId] = lesson_listeners;
  return default_listeners;
}

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
    that.$store.commit("student/updateInteraction", {
      name: "sign",
      params: { start: true, endTime: Date.now() + 60000 },
    });
  },
  test(data, that) {
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
  enter(data, that) {
    console.log("someone join class", data);
  },
};

export default function studentListeners(lessonId) {
  if (!lessonId) return default_listeners;
  default_listeners[lessonId] = lesson_listeners;
  return default_listeners;
}
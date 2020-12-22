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
};

export default getter;

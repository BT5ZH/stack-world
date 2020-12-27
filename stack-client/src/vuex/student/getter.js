const getter = {
  getHomeworkInfo(state, id) {
    let index = this.checkedList.findIndex((item) => {
      return item.hid === id;
    });
    return state.homeworkList[index];
  },
  lessonIdList(state) {
    return state.courseList.map((item) => item.lesson_id);
  },
};

export default getter;

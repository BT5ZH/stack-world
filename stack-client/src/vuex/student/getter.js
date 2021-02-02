const getter = {
  lessonIdList(state) {
    return state.courseList.map((item) => item.lesson_id);
  },
};

export default getter;

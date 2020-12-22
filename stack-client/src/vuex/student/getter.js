const getter = {
  lessonIdList(state) {
    return state.courseList.map((course) => course.lesson_id);
  },
};

export default getter;

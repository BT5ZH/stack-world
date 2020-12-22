const getter = {
  lessonIdList(state) {
    return state.courseList.map((course) => course.lessonId);
  },
};

export default getter;

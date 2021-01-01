import axios from "@/utils/axios";

function errorHandler(data, funcName) {
  if (data.status !== "success") {
    throw `[vuex-teacher-action] response status of '${funcName}' is not success`;
  }
}

const action = {
  async getCourseCalendar({ commit }, teacher_id) {
    try {
      const url = "pc/v1/timetables/getTimeTableFromTeacherID";
      const { data } = await axios.post(url, { teacher_id });
      errorHandler(data);
      const courseCalendar = data.data.map((item) => {
        return {
          courseName: item.course_id.name,
          lessonId: item.lesson_id,
          teacherName: item.teacher_id.name,
          JobNumber: item.teacher_id.user_id,
          curriculum: item.curriculum,
        };
      });
      commit("updateCourseCalendar", courseCalendar);
    } catch (error) {
      console.error(error);
    }
  },
  async getTeacherCourses({ commit }, teacher_id) {
    try {
      const url = "pc/v1/lessons/getLessonsByTeacherID";
      const requestData = { teacher_id };
      const { data } = await axios.post(url, requestData);
      commit("updateTeacherCourses", data.abstractInfo);
    } catch (error) {
      console.error(error);
    }
  },
};

export default action;

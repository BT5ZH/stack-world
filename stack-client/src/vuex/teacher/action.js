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
      let date = new Date();
      let month = date.getMonth() + 1;
      const { data } = await axios.post(url, {
        teacher_id,
        year: date.getFullYear().toString(),
        semester: (month >= 3 && month <= 8 ? 2 : 1).toString(),
      });
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
  async getTeacherPrepare({ commit }, teacher_id) {
    try {
      // TODO 完善教师备课获取函数
      const url = "/pc/v1/prepares/";
      const requestData = { teacher_id };
      const { data } = await axios.post(url, requestData);
      commit("updateTeacherPrepare", data);
    } catch (error) {
      console.error(error);
    }
  },
  async getOnlineStudents({ commit }, lesson_id) {
    try {
      const url = "/pc/v1/activities/online_list";
      const { data } = await axios.get(`${url}/${lesson_id}`);
      if (data.status) {
        commit("updateOnlineList", data.data);
      }
    } catch (error) {
      console.error(error);
    }
  },
  async getCourseHours({ commit }, { lesson_id, teacher_id }) {
    try {
      const requestData = { teacher_id, lesson_id };
      const url = "pc/v1/prepares/getOnePrepareLesson";
      const { data } = await axios.post(url, requestData);
      commit("updateCourseHours", data.lesson);
    } catch (error) {
      console.error(error);
    }
  },
  async updateCourseHour({ commit, state }, params) {
    try {
      const url = "pc/v1/prepares/updateOnePrepareLesson";
      let requestData = {
        ...state.courseHours[state.curCourseHour],
        ...params,
        section_index: state.curCourseHour + 1,
      };
      const { data } = await axios.post(url, requestData);
      commit("updateCourseHour", data.message.one_class[state.curCourseHour]);
    } catch (error) {
      console.error(error);
    }
  },
  async getSources({ commit }, { lesson_id, teacher_id }) {
    try {
      const requestData = { teacher_id, lesson_id };
      const url = "pc/v1/resources/getLessonResourceOfTeacher";
      const { data } = await axios.post(url, requestData);
      commit("updateSources", data.resource);
    } catch (error) {
      console.error(error);
    }
  },
  async getLessonNames({ commit }, { lesson_id, teacher_id }) {
    try {
      const requestData = { teacher_id, lesson_id };
      const url = "pc/v1/prepares/getOnePrepareLesson";
      const { data } = await axios.post(url, requestData);
      commit("updateLessonNames", data.names);
    } catch (error) {
      console.error(error);
    }
  },
  async getquestionBank({ commit }, { lesson_id, teacher_id }) {
    try {
      const requestData = { teacher_id, lesson_id };
      const url = "pc/v1/questions";
      const { data } = await axios.get(url, requestData);
      commit("updatequestionBank", data.questions);
    } catch (error) {
      console.error(error);
    }
  },
};

export default action;

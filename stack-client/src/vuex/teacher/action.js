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
      const url = "pc/v1/lessons/lessons";
      const requestData = { teacher_id };
      const { data } = await axios.post(url, requestData);
      console.log(data.abstractInfo);
      commit("updateTeacherCourses", data.abstractInfo);
    } catch (error) {
      console.error(error);
    }
  },
  async getTeacherPrepare({ commit }, params) {
    // params => teacher_id, lesson_id, name
    try {
      const url = "/pc/v1/prepares/getOneClassByName";
      const { data } = await axios.post(url, params);
      commit("updateTeacherPrepare", data.data.one_class);
    } catch (error) {
      console.error(error);
    }
  },
  async getOnlineStudents({ commit }, lesson_id) {
    try {
      const url = "/pc/v1/activities/online_list";
      const { data } = await axios.get(`${url}/${lesson_id}`);
      console.log(data.data);
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
      commit("updateSources", []);
      console.error(error);
    }
  },
  async getLessonNames({ commit }, { lesson_id, teacher_id }) {
    try {
      const requestData = { teacher_id, lesson_id };
      const url = "pc/v1/prepares/getOnePrepareLesson";
      const { data } = await axios.post(url, requestData);
      console.log(data);
      commit("updateLessonNames", data.names);
    } catch (error) {
      console.error(error);
    }
  },
  async getquestionBank({ commit }, payload) {
    let queryString = "";
    Object.keys(payload).forEach((key) => {
      queryString += key + "=" + payload[key] + "&";
    });
    queryString = "?" + queryString.slice(0, -1);
    const url = "/pc/v1/questions" + queryString;
    try {
      const { data } = await axios.get(url);
      commit("updatequestionBank", data.questions);
    } catch (error) {
      console.error(error);
    }
  },
  async getquestionBankByPaperID({ commit }, { paper_id }) {
    try {
      const requestData = { paper_id };
      const url = "pc/v1/questions/paper/getquestionBankByPaperID";
      const { data } = await axios.post(url, requestData);
      commit("updateQuesOfPaper", data.questions);
    } catch (err) {
      console.error(err);
    }
  },
  async getSetHomeworksByLessonID({ commit }, { lesson_id }) {
    try {
      const requestData = { lesson_id };
      const url = "pc/v1/sethomeworks/getSetHomeworkByLessonID";
      const { data } = await axios.post(url, requestData);
      commit("updateSetHomeworks", data.Homeworks);
    } catch (err) {
      console.error(err);
    }
  },

  async getPapersByLessonID({ commit }, { lesson_id }) {
    try {
      const requestData = { lesson_id };
      const url = "pc/v1/questions/paper/getPapersByLessonID";
      const { data } = await axios.post(url, requestData);
      commit("updatePapers", data.papers);
    } catch (err) {
      console.error(err);
    }
  },
  async getCourseInfo({ commit }, lesson_id) {
    try {
      const url = "/pc/v1/lessons/getCourseInfoByLessonID";
      const { data } = await axios.get(url, { params: { lesson_id } });
      const info = data.data.course_id;
      commit("updateCourseInfo", info);
    } catch (error) {
      console.error(error);
    }
  },
  // 修改教室状态,传入新的教室状态和教室id
  async updateRoomStatus({ commit }, params) {
    try {
      const url = `pc/v1/rooms/${params.room_id}`;
      await axios.patch(url, {
        room_status: params.status,
        living_lessonID: params.lessonId,
      });
    } catch (err) {
      console.error(err);
    }
  },
  async clearRoomMembers({ commit }, payload) {
    try {
      const url = `pc/v1/activities/online_list/${payload.channelId}`;
      const delResult = await axios.delete(url);
      console.log(delResult);
      if (delResult.status == 200) {
        console.log("更改成功");
        commit("clearOnlineList");
      }
    } catch (err) {
      console.error(err);
    }
  },
  async saveActivityData({ commit }, payload) {
    console.log(payload);
    try {
      const url = `pc/v1/activities/activity_data/${payload.curActivityID}`;

      await axios.patch(url, {
        sign_data: payload.signedData,
        activity_id: payload.curActivityID,
      });
    } catch (err) {
      console.error(err);
    }
  },
  // 当前活动ID写入STORE，方便后续使用
  setCurActivityID({ commit }, payload) {
    console.log("setCurActivityID action :");
    console.log(payload);
    commit("setCurActivityID", payload);
  },
  // 当前被授课班级ID写入STORE，方便后续使用
  setCurClass({ commit }, payload) {
    commit("setCurClass", payload);
  },
  //
  async setRealStudent({ commit }, payload) {
    console.log("获取上课学生列表");
    // console.log(payload);

    try {
      const url = `pc/v1/users/classList`;
      const { data } = await axios.post(url, payload);
      console.log(data);
      commit("setRealStudent", data.data);
    } catch (error) {
      console.log(error);
    }
  },
};

export default action;

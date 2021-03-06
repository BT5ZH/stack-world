<template>
  <div class="interaction">
    <div class="live">
      <div class="live-header">
        <h2>实时课堂</h2>
      </div>
      <div id="local_stream"></div>
      <div class="btn-area">
        <a-space>
          <a-button @click="createStream" type="primary">开启本地</a-button>
          <a-button @click="startLive" type="primary">开始授课</a-button>
          <a-button @click="closeLiveRoom" type="danger">结束直播</a-button>
          <a-button @click="closeRoom" type="danger">结束授课</a-button>
        </a-space>
      </div>
    </div>

    <div class="onlineInfo">
      <div class="onlineInfo-header">
        <div class="onlineInfo-filter">成员列表</div>
        <div class="onlineInfo-arrow">当前{{ currentAudience }}人在线</div>
      </div>
      <div class="onlineInfo-body">
        <div class="onlineInfo-body-title">
          <div class="onlineInfo-body-title-left">姓名</div>
          <div class="onlineInfo-body-title-center">进入时间</div>
          <div class="onlineInfo-body-title-right">是否签到</div>
        </div>
        <div class="onlineInfo-body-list">
          <ul class="onlineInfo-body-ul">
            <li
              class="onlineInfo-body-li"
              v-for="item in audienceList"
              :key="item.studentName"
            >
              <span class="onlineInfo-body-li-name">
                {{ item.studentName
                }}<b v-if="item.role === 'teacher'">🧑🏻‍🏫</b></span
              >
              <span class="onlineInfo-body-li-time">{{
                item.enterTime | timeFormatter
              }}</span>
              <span class="onlineInfo-body-li-flag">
                <b v-if="item.role !== 'teacher'">🐾</b>
                <b v-else>🔥</b></span
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- {{ item.signStatus }}-->
    </div>
  </div>
</template>

<script>
import TRTC from "trtc-js-sdk";
import axios from "@/utils/axios";
import * as socket from "@/utils/socket";
import { mapState } from "vuex";

export default {
  data() {
    return {
      client: null,
      localStream: null,
      roomDisabled: false,
      liveDisabled: true,
      closeDiabled: true,
      pagination: {
        pageSize: 6,
      },

      signedDataArray: [],
      questionDataArray: [],
      voteDataArray: [],
      testDataArray: [],
      fileDataArray: [],
    };
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
      precourse: (state) => state.teacher.precourse,
      curActivityID: (state) => state.teacher.curActivityID,
      curclassName: (state) => state.teacher.curclassName,
      curclassId: (state) => state.teacher.curclassId,
      teacherId: (state) => state.public.studentId,
      teacherName: (state) => state.public.userName,
      onlineList: (state) => state.teacher.onlineList,
      realStudents: (state) => state.teacher.curRealStudents,
      signList: (state) => state.teacher.signList,
      raceList: (state) => state.teacher.raceList,
      randomSignList: (state) => state.teacher.randomList,
      randomStudents: (state) => state.teacher.randomStudents,
      questionsDataList: (state) => state.teacher.ask_answer,
      voteDataList: (state) => state.teacher.voteAnswerList,
      testDataList: (state) => state.teacher.testAnswerList,
      fileDataList: (state) => state.teacher.fileAnswerList,
    }),
    audienceList() {
      let audienceList = this.onlineList.map((item) => {
        item.signStatus = "否";
        this.signList.forEach((element) => {
          if (element.studentName == item.studentName) {
            item.signStatus = "是";
          }
        });
        return {
          signStatus: item.signStatus,
          studentName: item.studentName,
          enterTime: item.enterTime,
          role: item.role,
          studentId: item.studentId,
        };
      });
      return audienceList;
    },
    lessonId() {
      return this.$route.query.lessonId;
    },
    currentAudience() {
      return this.audienceList.length;
    },
  },
  filters: {
    timeFormatter(value) {
      console.log(value);
      if (value == undefined) {
        return;
      }
      return value.trim().split(" ")[1];
    },
  },
  mounted() {
    this.$store.commit("teacher/clearOnlineList");
    this.$store.dispatch("teacher/getOnlineStudents", this.lessonId);
    // 2）当前课程活动写入课程事件数据
    let phaseArrData = [];
    console.log("当前课程活动写入课程事件数据");
    console.log(this.precourse.nodes);
    this.precourse.nodes.forEach((item, index) => {
      let objData = {
        phase_time: parseInt(item.time.slice(0, 2)),
        phase_type: item.tag,
        phase_index: index,
      };
      phaseArrData.push(objData);
    });
    console.log(phaseArrData);
    const payload = {
      activity_id: this.curActivityID,
      phases: phaseArrData,
    };
    console.log("更新教学活动测试");
    axios
      .patch("pc/v1/activities/" + this.curActivityID, payload)
      .then(({ data }) => {
        console.log("更新教学活动成功");
      })
      .catch((err) => {
        console.error(err);
        this.$message.error("更新活动失败");
      });
  },
  methods: {
    createClient(sdkAppId, userSig) {
      this.client = TRTC.createClient({
        mode: "live",
        sdkAppId,
        userId: this.uid,
        userSig,
        useStringRoomId: true,
      });
    },
    async createStream() {
      const localStream = TRTC.createStream({
        userId: this.uid,
        audio: true,
        video: true,
      });
      try {
        const result = await localStream.initialize();
        console.log("初始化本地流成功");
        localStream.play("local_stream");
        this.localStream = localStream;
      } catch (error) {
        console.log(error);
        this.$message.error("找不到可用直播设备");
        // TODO 处理所有类型错误
        //   switch (error.name) {
        //     case "NotReadableError":
        //       this.$message.error("找不到可用的音视频设备");
        //       break;
        //     default:
        //       console.error(error);
        //       break;
        //   }
      }
    },
    async startLive() {
      try {
        // 1) 获取直播TOKEN
        const { data } = await axios.post("/pc/v1/activities/user_sig", {
          user_id: this.uid,
        });
        if (!data.userSig) throw "no sig in response";
        console.log(data);
        // 2) 初始化直播客户端
        this.client = TRTC.createClient({
          mode: "live",
          sdkAppId: data.sdkAppId,
          userId: this.uid,
          userSig: data.userSig,
          useStringRoomId: true,
        });
        // 3) 初始化直播房间
        const connectAction = await this.client.join({
          roomId: this.lessonId,
          role: "anchor",
        });
        console.log(connectAction);
        this.roomDisabled = true;
        // 4) 向房间发布实时音视频流
        const publishAction = await this.client.publish(this.localStream);
        console.log(publishAction);
        console.log("本地流发布成功");
        this.$message.info("成功进入教室，系统正在播放您的声音");
        // 将教室状态修改为living
        this.$store.dispatch("teacher/updateRoomStatus", {
          room_id: this.$route.query.room_id,
          status: "living",
          lessonId: this.$route.query.lessonId,
        });
      } catch (error) {
        console.log(error);
        // this.$notification.error({
        //   message: "温馨提示",
        //   description: "本地流发布失败",
        // });
        //     console.error("本地流发布失败 " + error);
        //     this.$message.error("找不到可用直播设备");
      }
    },

    async closeLiveRoom() {
      try {
        const leaveResult = await this.client.leave();
        console.log(leaveResult);
        this.localStream.close();
        this.localStream = null;
        console.log("退房成功 ");
        // 修改教室状态为using
        this.$store.dispatch("teacher/updateRoomStatus", {
          room_id: this.$route.query.room_id,
          status: "using",
          lessonId: this.$route.query.lessonId,
        });
        // 退房成功，可再次调用client.join重新进房开启新的通话。
      } catch (error) {
        console.error("退房失败 " + error);
        // 错误不可恢复，需要刷新页面。
      }
    },
    async closeRoom() {
      try {
        // 1）保存本次课教学活动 TODO
        // 本次课活动列表
        let payload = {};
        this.precourse.nodes.forEach((node) => {
          if (node.tag === "Race") {
            this.saveRaceData(payload);
          }
          if (node.tag === "randomSign") {
            this.saveRandomSignData(payload);
          }
          if (node.tag === "Ask") {
            this.saveQuestionData();
            // 先赋值questionData 再清空questionDataArray
            [...payload.question_data] = this.questionDataArray;
            this.questionDataArray.length = 0;
          }
          if (node.tag === "Sign") {
            this.saveSignData();
            [...payload.sign_data] = this.signedDataArray;
            this.signedDataArray.length = 0;
          }
          if (node.tag === "Vote") {
            this.saveVoteData();
            [...payload.vote_data] = this.voteDataArray;
            this.voteDataArray.length = 0;
          }
          if (node.tag === "Test") {
            this.saveTestData();
            [...payload.test_data] = this.testDataArray;
            this.testDataArray.length = 0;
          }
          if (node.tag === "File") {
            this.saveFileData();
            [...payload.file_data] = this.fileDataArray;
            this.fileDataArray.length = 0;
          }
        });
        // this.$store.dispatch("teacher/saveActivityMessage", {
        //   curActivityID: this.curActivityID,
        //   request,
        // });
        (payload.curActivityID = this.curActivityID),
          await this.$store.dispatch("teacher/saveActivityData", payload);

        // 2）更改房间使用状态 清空redis
        this.$store.dispatch("teacher/clearRoomMembers", {
          channelId: this.$route.query.lessonId,
        });
        await this.$store.dispatch("teacher/updateRoomStatus", {
          room_id: this.$route.query.room_id,
          status: "avaliable",
          lessonId: null,
        });

        console.log("成功退出教室");
        // 3) 页面跳转返回主页 TODO
        socket.sendEvent("joinRoom", {
          actionType: "leave",
          role: "teacher",
          roomId: this.lessonId,
          data: { studentId: this.teacherId },
        });
        this.$store.commit("teacher/clearActivity");
        this.$router.push({ name: "teacher_index" });
      } catch (err) {
        console.log(err);
        this.$message.error("信息保存失败");
      }
    },
    saveRandomSignData(payload) {
      console.log(this.randomSignList);
      if (!payload.randomSign_data) payload.randomSign_data = [];
      console.log(this.randomStudents);
      this.randomStudents.forEach((student) => {
        student.signStatus = "未签到";
        this.randomSignList.forEach((randomData) => {
          if (student.studentName === randomData.studentName) {
            student.signStatus = "已签到";
          }
        });
      });
      payload.randomSign_data = this.randomStudents;
    },
    saveRaceData(payload) {
      if (!payload.race_data) payload.race_data = [];
      if (this.raceList.length === 0) {
        return;
      }
      let race_students = this.raceList.map((raceData) => {
        return {
          studentID: raceData.studentID,
          studentName: raceData.studentName,
          student_answer: raceData.answer,
        };
      });
      let race_question = {
        title: this.raceList[0].question.content,
        options: this.raceList[0].question.options,
        question_type: this.raceList[0].question.type,
        right_answer: this.raceList[0].question.right_answer,
      };
      payload.race_data.push({ race_students, race_question });
    },
    saveSignData() {
      // **************保存签到数据
      console.log("保存签到数据");
      let finalList = [];
      this.realStudents.forEach((real) => {
        let finalStatus = {};
        let flag = false;
        this.audienceList.forEach((online) => {
          if (real.user_id == online.studentId && online.role != "teacher") {
            finalStatus = {
              _id: real._id,
              studentId: online.studentId,
              studentName: online.studentName,
              enterTime: online.enterTime,
              signStatus: online.signStatus,
              joinFlag: true,
            };
            flag = true;
            finalList.push(finalStatus);
          }
        });
        if (flag == false) {
          finalStatus = {
            _id: real._id,
            studentId: real.user_id,
            studentName: real.name,
            enterTime: "",
            signStatus: "",
            joinFlag: false,
          };
          finalList.push(finalStatus);
        }
      });
      // let signedDataArray = [];
      let sData = {
        total_number: this.realStudents.length,
        real_number: this.audienceList.length - 1,
        class_name: this.curclassName,
        class_id: this.curclassId,
        class_list: finalList,
      };
      this.signedDataArray.push(sData);
    },
    saveQuestionData() {
      // **************保存提问数据
      let questionAnswersData = [];
      let join_student_count = 0;
      this.realStudents.forEach((real) => {
        let questionStatus = {};
        let flag = false;

        this.questionsDataList.forEach((online) => {
          if (real.user_id == online.studentId && online.role != "teacher") {
            questionStatus = {
              questionId: online.id,
              studentId: online.studentId,
              studentName: online.studentName,
              answerSelection: online.answerSelection,
              answerTime: online.answerTime,
              answerResult: online.answerResult,
              joinFlag: true,
            };
            join_student_count++;
            flag = true;
            questionAnswersData.push(questionStatus);
          }
        });
        if (flag == false) {
          questionStatus = {
            questionId: "",
            studentId: real.user_id,
            studentName: real.name,
            answerSelection: "",
            answerTime: "",
            answerResult: false,
            joinFlag: false,
          };
          questionAnswersData.push(questionStatus);
        }
      });

      let questionData = {
        total_number: this.realStudents.length,
        real_number: join_student_count,
        class_name: this.curclassName,
        class_id: this.curclassId,
        question_answer_list: questionAnswersData,
      };
      this.questionDataArray.push(questionData);
    },
    saveVoteData() {
      // **************保存投票数据
      let voteAnswersData = [];
      let join_student_count = 0;
      this.realStudents.forEach((real) => {
        let voteStatus = {};
        let flag = false;

        this.voteDataList.forEach((online) => {
          if (real.user_id == online.studentId && online.role != "teacher") {
            voteStatus = {
              studentId: online.studentId,
              studentName: online.studentName,
              submitTime: online.submitTime,
              joinFlag: true,
              phaseIndex: online.phaseIndex,
              result_list: online.result_list,
            };
            join_student_count++;
            flag = true;
            voteAnswersData.push(voteStatus);
          }
        });
        if (flag == false) {
          voteStatus = {
            studentId: real.user_id,
            studentName: real.name,
            submitTime: "",
            joinFlag: false,
            phaseIndex: "",
            result_list: "",
          };
          voteAnswersData.push(voteStatus);
        }
      });

      let voteData = {
        total_number: this.realStudents.length,
        real_number: join_student_count,
        class_name: this.curclassName,
        class_id: this.curclassId,
        vote_list: voteAnswersData,
      };
      this.voteDataArray.push(voteData);
    },
    saveTestData() {
      // **************保存随堂测试数据
      let testAnswersData = [];
      let join_student_count = 0;
      this.realStudents.forEach((real) => {
        let testStatus = {};
        let flag = false;

        this.testDataList.forEach((online) => {
          if (real.user_id == online.studentId && online.role != "teacher") {
            testStatus = {
              studentId: online.studentId,
              studentName: online.studentName,
              submitTime: online.submitTime,
              joinFlag: true,
              phaseIndex: online.phaseIndex,
              result_list: online.result_list,
            };
            join_student_count++;
            flag = true;
            testAnswersData.push(testStatus);
          }
        });
        if (flag == false) {
          testStatus = {
            studentId: real.user_id,
            studentName: real.name,
            submitTime: "",
            joinFlag: false,
            phaseIndex: "",
            result_list: "",
          };
          testAnswersData.push(testStatus);
        }
      });

      let testData = {
        total_number: this.realStudents.length,
        real_number: join_student_count,
        class_name: this.curclassName,
        class_id: this.curclassId,
        test_list: testAnswersData,
      };
      this.testDataArray.push(testData);
    },

    saveFileData() {
      let fileAnswersData = [];
      //**************保存随堂测试数据

      let join_student_count = 0;
      this.realStudents.forEach((real) => {
        let fileStatus = {};
        let flag = false;

        this.fileDataList.forEach((online) => {
          if (real.user_id == online.studentId && online.role != "teacher") {
            fileStatus = {
              studentId: online.studentId,
              studentName: online.studentName,
              submitTime: online.submitTime,
              joinFlag: true,
              phaseIndex: online.phaseIndex,
              result_list: online.result_list,
            };
            join_student_count++;
            flag = true;
            fileAnswersData.push(fileStatus);
          }
        });
        if (flag == false) {
          fileStatus = {
            studentId: real.user_id,
            studentName: real.name,
            submitTime: "",
            joinFlag: false,
            phaseIndex: "",
            result_list: "",
          };
          fileAnswersData.push(fileStatus);
        }
      });

      // fileAnswersData=this
      let fileData = {
        total_number: this.realStudents.length,
        real_number: join_student_count,
        class_name: this.curclassName,
        class_id: this.curclassId,
        file_list: fileAnswersData,
      };
      this.testDataArray.push(fileData);
    },
  },
};
</script>

<style scoped>
.interaction {
  display: flex;
  justify-content: space-around;
}
.onlineInfo {
  width: 25%;
}
.onlineInfo .onlineInfo-header {
  display: flex;
  position: relative;
  height: 46px;
  width: 100%;
  background: #f4f4f4;
  color: #222;
  border-radius: 2px;
  box-sizing: border-box;
  cursor: pointer;
}
.onlineInfo .onlineInfo-body {
  box-sizing: border-box;
  overflow: hidden;
  margin: 0 5px;
}
.onlineInfo .onlineInfo-body .onlineInfo-body-title {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  position: relative;
  padding: 8px 0;
  overflow: hidden;
  z-index: 1;
  zoom: 1;
}
.onlineInfo .onlineInfo-body .onlineInfo-body-title .onlineInfo-body-left {
  padding-left: 8px;
}
.onlineInfo .onlineInfo-body .onlineInfo-body-list {
  background-color: #fff;
  position: relative;
}
.onlineInfo .onlineInfo-body .onlineInfo-body-list ul {
  list-style: none;
  outline: none;
  padding-left: 0;
}
.onlineInfo .onlineInfo-body .onlineInfo-body-list ul li {
  font-size: 12px;
  color: #6d757a;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: space-between;
}

.onlineInfo .onlineInfo-body .onlineInfo-body-list .onlineInfo-body-li-name {
  width: 60px;
  position: relative;
  overflow: hidden;
}
.onlineInfo .onlineInfo-body .onlineInfo-body-list .onlineInfo-body-li-time {
  width: 88px;
  color: #222;
  position: relative;
  overflow: hidden;
}
.onlineInfo .onlineInfo-body .onlineInfo-body-list .onlineInfo-body-li-flag {
  width: 60px;
  position: relative;
  overflow: hidden;
}

.onlineInfo .onlineInfo-header .onlineInfo-arrow {
  height: 14px;
  position: absolute;
  right: 14px;
  top: 0;
  bottom: 0;
  margin: auto;
  color: #505050;
}
.onlineInfo .onlineInfo-header .onlineInfo-filter {
  display: flex;
  position: relative;
  box-sizing: border-box;
  z-index: 2;
  height: 46px;
  line-height: 46px;
  border: none;
  border-radius: 2px;
  padding: 0 10px 0 16px;
  zoom: 1;
}
/* h3,
ul li {
  color: #fff;
} */

.live {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.live .live-header h2 {
  color: #1890ff;
  text-align: center;
  margin-right: 1.5rem;
  font-weight: bold;
}

#local_stream {
  /* 屏幕宽度，在这改 */
  --width: 630px;
  --height: 400px;
  width: var(--width);
  height: var(--height);
  background-image: url("../../../assets/img/video/直播.png");
  background-size: var(--width) var(--height);
}

.btn-area {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>

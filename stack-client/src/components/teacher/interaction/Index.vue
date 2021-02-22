<template>
  <div>
    <div style="padding-top: 20px">
      <a-button @click="backHome" type="link"> 返回首页 </a-button>
    </div>
    <div style="margin: 20px 30px 0 30px">
      <div>
        <!-- 实时课堂 -->
        <div style="margin-bottom: 20px">
          <teacher-live></teacher-live>
        </div>
        <!-- 课堂活动 -->
        <div>
          <div>
            <h2 class="block-title">
              <a href="#">课堂活动</a>
            </h2>
          </div>

          <div>
            <div class="card-container" v-if="curEvent == -1">
              <a-empty description="暂无备课内容"></a-empty>
            </div>
            <div class="card-container" v-else>
              <a-row>
                <span class="action-type">{{ steps[curEvent].title }}</span>
              </a-row>
              <a-row :gutter="20" class="card-body">
                <a-col :span="18">
                  <h2>{{ steps[curEvent].desc }}</h2>
                </a-col>
                <a-col :span="2">
                  <a-button
                    shape="circle"
                    size="large"
                    @click="navigateToEvent(curEvent)"
                  >
                    <a-icon type="right-circle" style="font-size: 40px" />
                  </a-button>
                </a-col>
              </a-row>
            </div>
          </div>

          <div class="event-steps">
            <a-steps size="small" progress-dot v-model="curEvent" @change="eventChange">
              <a-step
                v-for="(step, index) in steps"
                :key="index"
                :title="step.title"
                :description="step.time"
              />
            </a-steps>
          </div>
        </div>
      </div>

      <div class="interactive">
        <result></result>
      </div>
    </div>
  </div>
</template>

<script>
import * as socket from "@/utils/socket";
import axios from "@/utils/axios";
import * as randomID from "@/utils/randomString";
import { mapState } from "vuex";
import TeacherLive from "./Live";
import Result from "./Result";

export default {
  components: { TeacherLive, Result },
  data() {
    return {
      actionMap: {
        sign: { name: "签到", desc: "请同学们开始签到" },
        test: { name: "随堂测试", desc: "请同学们开始作答" },
        teach: { name: "讲课", desc: "讲课时间" },
        ask: { name: "提问", desc: "开始提问" },
        race: { name: "抢答", desc: "请同学们开始抢答" },
        vote: { name: "投票", desc: "请同学们开始投票" },
        dispatch: { name: "文件下发", desc: "请同学们查看文件" },
        pick: { name: "提问", desc: "请同学回答问题" },
        randomsign: { name: "随机点名", desc: "请同学签到" },
      },
      curEvent: -1,
    };
  },
  methods: {
    backHome() {
      socket.sendEvent("joinRoom", {
        actionType: "leave",
        role: "teacher",
        roomId: this.lessonId,
        data: { studentId: this.teacherId },
      });
      this.$router.push({ name: "teacher_index" });
    },
    eventChange(value) {
      this.curEvent = value;
      this.$store.commit("teacher/updateCurActivity", {
        curType: this.steps[this.curEvent].type,
        curIndex: this.curEvent,
      });
    },
    navigateToEvent(eventIndex) {
      console.log("---step---");
      console.log(this.steps[eventIndex]);
      const event = this.steps[eventIndex];
      this[`send${event.type}Event`]();
    },
    sendsignEvent() {
      socket.sendEvent("joinRoom", {
        actionType: "sign",
        role: "teacher",
        roomId: this.lessonId,
      });
    },
    sendteachEvent() {
      console.log("授课过程");
    },
    sendtestEvent() {
      const testList = this.nodes[this.curEvent].vote;

      socket.sendEvent("joinRoom", {
        actionType: "test",
        role: "teacher",
        roomId: this.lessonId,
        data: [
          {
            id: "1U7GVC0",
            stem: "操作系统的目标有哪些？",
            type: "subject",
            multiple: true,
            options: ["有效性", "开放性", "可扩充性", "方便性"],
          },
        ],
      });
    },
    sendraceEvent() {
      const [raceData] = this.nodes[this.curEvent].vote;
      const limit = this.nodes[this.curEvent].people_num;
      socket.sendEvent("joinRoom", {
        actionType: "race",
        role: "teacher",
        roomId: this.lessonId,
        data: {
          start: true,
          limit,
          question: {
            // id: randomID.idCreator(6, 16),
            stem: raceData.title,
            type: raceData.question_type,
            right_answer: raceData.right_answer,
            multiple: raceData.question_type === 3,
            options: raceData.options,
          },
        },
      });
    },
    senddispatchEvent() {
      const [files] = this.nodes[this.curEvent].vote;
      const fileIdList = files.options;
      axios
        .post("pc/v1/resources/getURLByIDs", {
          resourceIDs: fileIdList,
        })
        .then(({ data }) => {
          socket.sendEvent("joinRoom", {
            actionType: "file",
            role: "teacher",
            roomId: this.lessonId,
            data: {
              fileList: data.data.map((item) => ({
                title: item.name,
                url: item.url,
              })),
            },
          });
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("获取文件信息失败");
        });
    },
    sendvoteEvent() {
      const voteList = this.nodes[this.curEvent].vote;
      socket.sendEvent("joinRoom", {
        actionType: "vote",
        role: "teacher",
        roomId: this.lessonId,
        data: voteList.map((item, index) => ({
          id: `AH83CP${index}`,
          stem: item.title,
          type: 2,
          multiple: false,
          options: item.options,
        })),
      });
    },
    sendaskEvent() {
      const [askData] = this.nodes[this.curEvent].vote;
      // console.log("askData+++++");
      // console.log(askData);
      let tempID = randomID.idCreator(6, 16);
      console.log(tempID);
      socket.sendEvent("joinRoom", {
        actionType: "ask",
        role: "teacher",
        roomId: this.lessonId,
        data: {
          start: true,
          question: {
            id: tempID,
            stem: askData.title,
            type: askData.question_type,
            multiple: false,
            right_answer: askData.right_answer,
            options: askData.options,
          },
        },
      });
    },
    sendrandomsignEvent() {
      if (this.signList[0] == undefined) {
        this.$message.info("请先发布大签到");
        return;
      }
      let studentIndex = this.randomNum(0, this.signList.length - 1);
      this.$store.commit(
        "teacher/addRandomStudent",
        this.signList[studentIndex].studentName
      );
      socket.sendEvent("joinRoom", {
        actionType: "randomSign",
        role: "teacher",
        roomId: this.lessonId,
        data: { studentList: this.signList[studentIndex].studentName },
      });
    },
    // 生成min,max的随机数
    randomNum(minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return parseInt(Math.random() * minNum + 1, 10);
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        //或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
        default:
          return 0;
      }
    },
  },

  computed: {
    ...mapState({
      onlineList: (state) => state.teacher.onlineList,
      signList: (state) => state.teacher.signList,
      uid: (state) => state.public.uid,
      teacherName: (state) => state.public.userName,
      teacherId: (state) => state.public.studentId,
      nodes: (state) => state.teacher.precourse.nodes,
    }),
    steps() {
      if (this.nodes == undefined || this.nodes.length == undefined) return [];
      return this.nodes.map((item) => ({
        type: item.tag.toLowerCase(),
        title: this.actionMap[item.tag.toLowerCase()].name,
        time: item.time,
        desc: this.actionMap[item.tag.toLowerCase()].desc,
      }));
    },
    lessonId() {
      return this.$route.query.lessonId;
    },
    courseHourName() {
      return this.$route.query.name;
    },
  },
  mounted() {
    const callback = (id) => {
      socket.sendEvent("joinRoom", {
        actionType: "enter",
        role: "teacher",
        roomId: this.lessonId,
        data: { studentId: this.teacherId, studentName: this.teacherName },
      });
      socket.sendEvent("public", {
        actionType: "classBegin",
        role: "teacher",
        data: { lessonId: this.lessonId, teacherId: this.uid },
      });
    };
    socket.createInstance("teacher", this, this.lessonId).then(callback);
    this.$store.dispatch("teacher/getTeacherPrepare", {
      teacher_id: this.uid,
      lesson_id: this.lessonId,
      name: this.courseHourName,
    });
  },
};
</script>

<style scoped>
.block-title {
  text-align: center;
  margin-right: 1.5rem;
  font-weight: bold;
}

.card-body h2 {
  padding: 20px 0;
  margin: 0 0 0 50px;
}

.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-container {
  margin: 10px 0;
  border-radius: 10px;
  height: 120px;
  box-shadow: 0 0 10px #ccc;
  /* box-shadow: 10px 10px 5px #888888; */
}

.action-type {
  padding: 5px 10px;
  background-color: #409eff;
  color: #fff;
}

.event-steps {
  padding: 50px 0 30px;
}

.interactive {
  position: fixed;
  z-index: 10;
  width: 100%;
  min-height: 70vh;
  overflow: scroll;
  background: #f4f4f4e6;
  transition: transform 1.4s ease;
}
.interactive .interactive-title {
  color: #fff;
  font-size: 30px;
  letter-spacing: 5px;
  font-weight: 400;
  padding: 15px;
}
.interactive:hover {
  transform: translateY(-70vh);
}
</style>

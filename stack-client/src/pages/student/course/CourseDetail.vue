<template>
  <div>
    <a-row class="course_menu">
      <a-col :span="6" :key="index" v-for="(item, index) in courseDetailMenu">
        <!-- 菜单栏 -->
        <button
          :class="
            isClick == index ? 'courseDetailMenu active' : 'courseDetailMenu'
          "
          @click="changeNav(index)"
        >
          {{ item.title }}
        </button>
      </a-col>
    </a-row>
    <div class="course_content" v-if="isClick == 0">
      <a-empty v-if="resList.length == 0" />
      <!-- <leftSlider -->
      <resCard
        v-else
        v-for="item in resList"
        :key="item.hid"
        :item="item"
        :isClick="isClick"
        :courseId="courseId"
      >
      </resCard>
      <!-- </leftSlider> -->
    </div>
    <div class="course_content" v-if="isClick == 1">
      <!-- <div v-if="courseStart"> -->
      <div class="">
        <div id="remote_stream"></div>
        <a-divider></a-divider>
        <gridView4 :gridItems="classMenu" :itemFlag.sync="flag"></gridView4>

        <a-divider style="margin-bottom: 0"></a-divider>
        <div>
          <sign v-if="flag == 1" :socket="socket"></sign>
          <quiz v-if="flag == 2" :socket="socket"></quiz>
          <random v-if="flag == 3" :socket="socket"></random>
          <file v-if="flag == 4" :socket="socket"></file>
          <vote v-if="flag == 5" :socket="socket"></vote>
          <test v-if="flag == 6" :socket="socket"></test>
          <race v-if="flag == 7" :socket="socket"></race>
        </div>
      </div>
    </div>

    <div class="course_content" v-if="isClick == 2">
      <a-empty v-if="homeworkList.length == 0" />
      <resCard
        v-else
        v-for="item in homeworkList"
        :key="item.hid"
        :item="item"
        :isClick="isClick"
        :courseId="courseId"
      >
      </resCard>
    </div>

    <div class="course_content" v-if="isClick == 3">
      <a-empty v-if="examList.length == 0" />
      <resCard
        v-else
        v-for="item in examList"
        :key="item.id"
        :item="item"
        :isClick="isClick"
        :courseId="courseId"
      >
      </resCard>
    </div>
  </div>
</template>

<script>
import leftSlider from "../../../components/LeftSlider.vue";
import resCard from "../../../components/student/ResCard.vue";
import gridView4 from "../../../layout/GridView4.vue";

import sign from "./class/Sign.vue";
import random from "./class/Random.vue";
import vote from "./class/Vote.vue";
import test from "./class/Test.vue";
import quiz from "./class/Quiz.vue";
import race from "./class/Race";
import file from "./class/File";

import { mapState } from "vuex";
import * as socket from "@/utils/socket";
import TRTC from "trtc-js-sdk";
import axios from "@/utils/axios";

export default {
  name: "CourseHome",
  components: {
    //leftSlider,
    resCard,
    gridView4,
    sign,
    random,
    vote,
    test,
    quiz,
    file,
    race,
  },
  data() {
    return {
      isClick: 1,
      courseId: null,
      lessonId: "",
      flag: 0,
      socket,
      courseDetailMenu: [
        { title: "预习" },
        { title: "课堂" },
        { title: "作业" },
        { title: "考试" },
      ],
    };
  },
  methods: {
    changeNav(value) {
      this.isClick = value;
    },
    initLiveClient() {
      axios
        .post("/pc/v1/activities/user_sig", {
          user_id: this.userId,
        })
        .then(({ data }) => {
          if (!data.userSig) throw "no sig in response";
          this.client = TRTC.createClient({
            mode: "live",
            sdkAppId: data.sdkAppId,
            userId: this.userId,
            userSig: data.userSig,
            useStringRoomId: true,
          });
          this.joinRoom();
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("获取直播Token失败");
        });
    },
    joinRoom() {
      this.client
        .join({ roomId: this.lessonId, role: "audience" })
        .catch((error) => {
          console.error(error);
          this.$message.success("进入教室失败，请刷新后重试");
        })
        .then(() => {
          this.$message.success("成功进入教室");
          this.client.on("stream-added", (event) => {
            this.client.subscribe(event.stream);
          });
          this.client.on("stream-subscribed", (event) => {
            // 删除可能出现的多余播放器
            let player = document.getElementById("remote_stream");
            // console.log("player");
            // console.log(player);
            player.innerHTML = "";
            // 开始播放
            event.stream.play("remote_stream");
          });
        });
    },
    closeLive() {
      this.client
        .leave()
        .then(() => {
          console.error("退房成功 ");
          // 退房成功，可再次调用client.join重新进房开启新的通话。
        })
        .catch((error) => {
          console.error("退房失败 " + error);
          // 错误不可恢复，需要刷新页面。
        });
    },
  },
  created() {
    this.courseId = this.$route.params.id;
    this.lessonId = this.$route.query.lessonId;
  },
  mounted() {
    // 初始化WEB socket 管道
    socket.createInstance("student", this, this.lessonId);

    socket.sendEvent("joinRoom", {
      actionType: "enter",
      role: "student",
      roomId: this.lessonId,
      data: { studentId: this.studentId, studentName: this.studentName },
    });

    // 初始化腾讯实时音视频
    this.initLiveClient();

    // 获取作业数据
    let lesson_id = this.$route.query.lessonId;
    let student_id = this.userId;
    this.$store.dispatch("student/getHomeworkList", { lesson_id, student_id });

<<<<<<< HEAD
    // 获取试卷数据
    this.$store.dispatch("student/getExamList", { lesson_id, student_id });
  },
  computed: {
    ...mapState({
      userId: (state) => state.public.uid,
      studentId: (state) => state.public.studentId,
      studentName: (state) => state.public.userName,
      classMenu: (state) => state.student.classMenu,
      resList: (state) => state.student.resList,
      examList: (state) => state.student.examList,
      classList: (state) => state.student.classList,
      homeworkList: (state) => state.student.homeworkList,
      openRooms: (state) => state.student.openRooms,
    }),
    courseStart() {
      return this.openRooms.some((item) => item === this.lessonId);
=======
      // 获取试卷数据
      this.$store.dispatch("student/getExamList", { lesson_id, student_id });
     
    },
    computed: {
      ...mapState({
        userId: (state) => state.public.uid,
        studentId: (state) => state.public.studentId,
        studentName: (state) => state.public.userName,
        classMenu: (state) => state.student.classMenu,
        resList: (state) => state.student.resList,
        examList: (state) => state.student.examList,
        classList: (state) => state.student.classList,
        homeworkList: (state) => state.student.homeworkList,
        openRooms: (state) => state.student.openRooms,
      }),
      courseStart() {
        return this.openRooms.some((item) => item === this.lessonId);
      },
    },
    beforeRouteLeave(to, from, next) {
      socket.sendEvent("joinRoom", {
        actionType: "leave",
        role: "student",
        roomId: this.lessonId,
        data: { studentId: this.studentId },
      });
      next();
>>>>>>> 946556b9e8b0c8e171a636c16cbb412eb029667f
    },
  },
  beforeRouteLeave(to, from, next) {
    socket.sendEvent("joinRoom", {
      actionType: "leave",
      role: "student",
      roomId: this.lessonId,
      data: { studentId: this.studentId },
    });
    next();
  },
};
</script>

<style lang="scss">
#remote_stream {
  width: 100%;
  height: 300px;
  background-image: url("../../../assets/img/video/直播.png");
}

.course_menu {
  margin-bottom: 2rem;
}

.courseDetailMenu {
  width: 100%;
  height: 100%;
  padding: 1.5rem 0;
  text-align: center;
  border: none;
  background-color: #f5f7fa;
  z-index: -1;
}

.courseDetailMenu:active,
.courseDetailMenu:focus {
  outline: none;
}

.active {
  background-color: #fff;
  color: #50b8ee;
}
</style>

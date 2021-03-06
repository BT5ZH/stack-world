<template>
  <div class="course_home">
    <div id="remote_stream"></div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TRTC from "trtc-js-sdk";
import axios from "@/utils/axios";
import * as socket from "@/utils/socket";

export default {
  name: "CourseHome",
  components: {},
  data() {
    return {
      lessonId: this.$route.query.lessonId,
    };
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
  },
  computed: {
    ...mapState({
      userId: (state) => state.public.uid,
      studentId: (state) => state.public.studentId,
      studentName: (state) => state.public.userName,
    }),
  },
  methods: {
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
  },
};
</script>

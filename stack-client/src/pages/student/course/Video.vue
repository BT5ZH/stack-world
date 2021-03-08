<template>
  <div style="width: 100%; min-height: fit-content">
    <video
      id="myVideo"
      :key="currentVideo"
      style="width: 100%"
      preload="auto"
      controlsList="nodownload"
      controls
      autoplay
    >
      <source :src="$route.query.url" type="video/mp4" />
    </video>
  </div>
</template>

<script>
export default {
  name: "videoPage",
  data() {
    return {
      currentVideo: 1,
      videoState: false, // 视频播放状态
      // 学时
      studyTime: {
        currentTime: 0, // 当前已学时长
        duration: 0, // 总时长
      },
      timer: {}, // 定时器
      pauseTimer: {}, // 暂停定时器
    };
  },
  mounted() {
    // // 监听视频播放
    // this.$refs.myVideo.addEventListener("play", () => {
    //     console.log("video is playing");
    //     this.openTimer();
    // });
    // // 监听视频暂停
    // this.$refs.myVideo.addEventListener("pause", () => {
    //     console.log("video is stop");
    //     this.closeTimer();
    // });
  },
  methods: {
    // // 开启定时器
    // openTimer() {
    //     this.timer = setInterval(() => {
    //         this.$emit("videoStudyTime", this.studyTime);
    //     }, 5000);
    // },
    // // 关闭定时器
    // closeTimer() {
    //     clearInterval(this.timer);
    //     this.$emit("videoStudyTime", this.studyTime);
    // },
    // // 开启暂停定时器
    // openPauseTimer() {
    //     this.pauseTimer = setInterval(() => {
    //         this.hintOperate();
    //     }, 600000);
    // },
    // // 关闭暂停定时器
    // closePauseTimer() {
    //     clearInterval(this.pauseTimer);
    // },
    // // 获取当前播放位置
    // timeupdate(e) {
    //     this.studyTime.currentTime = e.target.currentTime;
    //     this.studyTime.duration = e.target.duration ? e.target.duration : 0;
    // },
    // // 操作视频播放、暂停
    // operateVideo() {
    //     if (!this.src) {
    //         this.$message({ message: "暂无视频资源，请查看其他视频！" });
    //         return false;
    //     }
    //     if (this.$refs.myVideo.paused) {
    //         this.$refs.myVideo.play();
    //         this.videoState = true;
    //     } else {
    //         this.$refs.myVideo.pause();
    //         this.videoState = false;
    //     }
    // }
  },
  watch: {
    // 监听操作
    // videoData(val, oldVal) {
    //     const { currentTime, duration } = val;
    //     if (currentTime && duration && currentTime < duration) {
    //         this.hintOperate();
    //     }
    // }
  },
};
</script>

<style>
.video_container {
  min-width: 100%;
  min-height: 40rem;
  background-color: #fff;
}
</style>

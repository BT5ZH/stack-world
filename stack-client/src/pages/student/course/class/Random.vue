<template>
  <div
    class="NeuroStyle NeuroStyle__sign"
    style="background-image: url('../../../src/assets/img/Wireframe.png')"
  >
    <button class="NeuroStyle__button NeuroStyle__button--sign" @click="signin">
      <span>{{ randomSign.randomStudent }}</span>
    </button>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    socket: {
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
      studentId: (state) => state.public.studentId,
      name: (state) => state.public.userName,
      openRooms: (state) => state.student.openRooms,
      randomSign: (state) => state.student.interaction.randomSign,
    }),
    lessonId() {
      return this.$route.query.lessonId;
    },
  },
  mounted() {},
  methods: {
    signin() {
      if (!this.randomSign.start) {
        this.$message.info("老师还没有发布签到哦！");
        return null;
      }
      if (this.name != this.randomSign.randomStudent) {
        this.$message.info("没有抽到你签到哦！");
        return;
      }
      const channel = this.openRooms[0];
      this.socket.sendEvent("joinRoom", {
        role: "student",
        actionType: "randomSign",
        roomId: channel,
        data: {
          studentId: this.studentId,
          studentName: this.name,
        },
      });
      // 清空随机点名列表
      this.$store.commit("student/clearRandomMessage");
      // 关闭事件徽标
      this.$store.commit("student/updateStudentBadge", {
        event: "random",
        status: false,
      });
    },
  },
};
</script>

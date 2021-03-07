<template>
  <div
    class="NeuroStyle NeuroStyle__sign"
    style="background-image: url('../../../src/assets/img/Wireframe.png')"
  >
    <button class="NeuroStyle__button NeuroStyle__button--sign" @click="signin">
      <span>签到</span>
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
    return {
      // 签到状态
      signStatus: false,
    };
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
      studentId: (state) => state.public.studentId,
      major_name: (state) => state.public.major_name,
      name: (state) => state.public.userName,
      openRooms: (state) => state.student.openRooms,
      signState: (state) => state.student.interaction.sign,
    }),
    lessonId() {
      return this.$route.query.lessonId;
    },
  },
  mounted() {},
  methods: {
    signin() {
      try {
        if (this.signStatus == true) {
          this.$message.info("不可重复签到!");
          return;
        }
        if (!this.signState.start) {
          this.$message.info("老师还没有发布签到哦！");
          return null;
        }
        const channel = this.openRooms[0];
        this.socket.sendEvent("joinRoom", {
          role: "student",
          actionType: "sign",
          roomId: channel,
          data: {
            studentId: this.studentId,
            studentName: this.name,
          },
        });
        // 签到状态
        this.signState.start = false;
        // 重复签到检测
        this.signStatus = true;
        // 签到徽标
        this.$store.commit("student/updateStudentBadge", {
          event: "sign",
          status: false,
        });
      } catch (err) {
        this.$message.error("签到失败");
        console.log(err);
      }
    },
  },
};
</script>

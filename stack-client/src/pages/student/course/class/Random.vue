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
    return {
    };
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
      user_id: (state) => state.public.user_id,
      name: (state) => state.public.name,
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
          studentId: this.user_id,
          studentName: this.name,
        },
      });
    },
  },
};
</script>

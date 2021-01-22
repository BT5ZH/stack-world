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
    };
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
      user_id: (state) => state.public.user_id,
      major_name: (state) => state.public.major_name,

      name: (state) => state.public.name,
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
          studentId: this.user_id,
          studentName: this.name,
        },
      });
    },
  },
};
</script>

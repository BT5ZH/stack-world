<template>
  <div
    class="NeuroStyle NeuroStyle__sign"
    style="background-image: url('../../../src/assets/img/Wireframe.png');"
  >
    <button class="NeuroStyle__button NeuroStyle__button--sign" @click="signin">
      <span>签到</span>
    </button>
  </div>
</template>

<script>
import * as socket from "@/utils/socket";
import { mapState } from "vuex";
export default {
  data() {
    return {
      studentId: "2020000222",
      className: "软件工程一班",
    };
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
      name: (state) => state.public.name,
    }),
  },
  mounted: {},
  methods: {
    signin() {
      socket.sendEvent({
        roomId: this.$route.query.lessonId,
        data: {
          actionType: "sign",
          data: {
            studentId: this.studentId,
            studentName: this.name,
            className: this.className,
          },
        },
      });
    },
  },
};
</script>

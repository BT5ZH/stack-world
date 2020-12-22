<template>
  <div>
    提问
    <button @click="sendMessage">提问</button>
  </div>
</template>

<script>
import * as socket from "@/utils/socket";
export default {
  data() {
    return {};
  },
  methods: {
    quesActivity() {
      socket.createInstance(this, {
        ques: (eventData) => {
          console.log(eventData.message);
        },
      });
    },
    sendMessage() {
      socket.sendEvent({ type: "ques", data: { message: "ques" } });
    },
  },
  mounted() {
    this.quesActivity();
    //
  },
};
</script>

<style scoped></style>

<template>
  <div>
    随堂测试
    <button @click="sendMessage">随堂测试</button>
  </div>
</template>

<script>
import * as socket from "@/utils/socket";
export default {
  data() {
    return {};
  },
  methods: {
    testActivity() {
      socket.createInstance(this, {
        test: (eventData) => {
          console.log(eventData.message);
        },
      });
    },
    sendMessage() {
      socket.sendEvent({
        type: "joinRoom",
        data: { answer: "A", roomId: "12345", activityType: "test" },
      });
    },
  },
  mounted() {
    this.testActivity();
    //
  },
};
</script>

<style scoped></style>

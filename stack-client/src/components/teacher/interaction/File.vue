<template>
  <div>
    文件下发
    <button @click="sendMessage">文件下发</button>
  </div>
</template>

<script>
import * as socket from "@/utils/socket";
export default {
  data() {
    return {};
  },
  methods: {
    fileActivity() {
      socket.createInstance(this, {
        file: (eventData) => {
          console.log(eventData.message);
        },
      });
    },
    sendMessage() {
      socket.sendEvent({ type: "file", data: { message: "fileSend" } });
    },
  },
  mounted() {
    this.fileActivity();
    //
  },
};
</script>

<style scoped></style>

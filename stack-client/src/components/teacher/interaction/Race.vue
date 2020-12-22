<template>
  <div>
    抢答
    <button @click="sendMessage">抢答</button>
  </div>
</template>

<script>
import * as socket from "@/utils/socket";
export default {
  data() {
    return {};
  },
  methods: {
    quickAnswer() {
      socket.createInstance(this, {
        race: (eventData) => {
          console.log(eventData.message);
        },
      });
    },
    sendMessage() {
      socket.sendEvent({ type: "sign", data: { message: "signin" } });
    },
  },
  mounted() {
    this.quickAnswer();
    //
  },
};
</script>

<style scoped></style>

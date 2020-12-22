<template>
  <div>
    随机抽人
    <button @click="sendMessage">随机抽人</button>
  </div>
</template>

<script>
import * as socket from "@/utils/socket";
export default {
  data() {
    return {};
  },
  methods: {
    pickActivity() {
      socket.createInstance(this, {
        pick: (eventData) => {
          console.log(eventData.message);
        },
      });
    },
    sendMessage() {
      socket.sendEvent({ type: "pick", data: { message: "pick" } });
    },
  },
  mounted() {
    this.pickActivity();
    //
  },
};
</script>

<style scoped></style>

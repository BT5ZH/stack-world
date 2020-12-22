<template>
  <div>
    <v-chart :options="config" />
    <button @click="sendMessage">投票</button>
  </div>
</template>

<script>
import * as socket from "@/utils/socket";
import ECharts from "vue-echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/dataZoom";
import "echarts/lib/component/title";

export default {
  components: { "v-chart": ECharts },
  data() {
    return {};
  },
  methods: {
    voteActivity() {
      socket.createInstance(this, {
        vote: (eventData) => {
          console.log(eventData.message);
        },
      });
    },
    sendMessage() {
      socket.sendEvent({ type: "vote", data: { message: "vote" } });
    },
  },
  mounted() {
    this.voteActivity();
    //
  },
  computed: {
    config() {
      return {
        tooltip: {
          formatter: "{b}: {c}名",
        },
        color: ["#019d96"],
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: { type: "value" },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(220, 220, 220, 0.8)",
            },
          },
        ],
      };
    },
  },
};
</script>

<style scoped></style>

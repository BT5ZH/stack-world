<template>
  <div>
    <a-empty v-if="emptyShow" class="empty-area"></a-empty>
    <a-row v-else v-for="(item, index) in tempdata" :key="index" class="chart">
      <v-chart :options="item.echartConfig" />
    </a-row>
  </div>
</template>

<script>
import ECharts from "vue-echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/title";
import { mapState } from "vuex";
import * as socket from "@/utils/socket";

export default {
  components: { "v-chart": ECharts },
  data() {
    return {
      testAnswerList: {},
      tempdata: [],
      emptyShow: true,
    };
  },
  methods: {
    getEchartConfig(value) {
      return {
        color: ["#019d96"],
        xAxis: {
          type: "category",
          data: Object.keys(value),
        },
        yAxis: { type: "value", minInterval: 1 },
        series: [
          {
            data: Object.values(value),
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(220, 220, 220, 0.8)",
            },
          },
        ],
      };
    },
    testAnswer() {
      this.tempdata = Object.keys(this.testAnswerList).map((item) => {
        return {
          quesId: item,
          echartConfig: this.getEchartConfig(this.testAnswerList[item]),
        };
      });
      this.emptyShow = false;
    },
  },
  computed: {
    // ...mapState({
    //   testAnswerList: (state) => state.teacher.testAnswerList,
    // }),
    // getEchartConfig() {
    //   return;
    // },
  },
  mounted() {
    socket.createInstance("teacher", this, this.lessonId);
  },
  boforeDestroy() {
    // TODO 给出提示，刷新后数据丢失
  },
};
</script>

<style scoped>
.chart {
  padding: 20px 0;
}
.empty-area {
  padding: 80px 40px;
}
</style>
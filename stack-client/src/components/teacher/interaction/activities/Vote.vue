<template>
  <div>
    <h1 class="sign-title">投票结果</h1>
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
import { mapState, mapGetters } from "vuex";

export default {
  components: { "v-chart": ECharts },
  data() {
    return {};
  },
  methods: {
    getEchartConfig(value) {
      delete value.id;
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
  },
  computed: {
    emptyShow() {
      return !this.voteAnswerList.length;
    },
    voteAnswerList() {
      return this.$store.state.teacher.voteAnswerList;
    },
    tempdata() {
      return this.voteAnswerList.map((ques) => ({
        quesId: ques.id,
        echartConfig: this.getEchartConfig(Object.assign({}, ques)),
      }));
    },
  },
};
</script>

<style scoped>
.echarts {
  width: 100%;
  height: 400px;
}
.empty-area {
  padding: 80px 40px;
}
.sign-title {
  font-weight: bold;
  color: #bbb;
  text-align: center;
  padding-top: 20px;
}
</style>
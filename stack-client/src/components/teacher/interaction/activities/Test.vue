<template>
  <div>
    <h1 class="sign-title">测试结果</h1>
    <a-empty v-if="emptyShow" class="empty-area"></a-empty>
    <a-row v-else v-for="(item, index) in localList" :key="index" class="chart">
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
    return { localList: [] };
  },
  computed: {
    ...mapState({
      testData: (state) => state.student.interaction.test,
      teacherId: (state) => state.public.studentId,
      teacherName: (state) => state.public.userName,
      testShowList: (state) => state.teacher.testShowList,
      testRefresh: (state) => state.teacher.testRefresh,
    }),
    emptyShow() {
      return !this.testShowList.length;
    },
    // testAnswerList() {
    //   return this.$store.state.teacher.testAnswerList;
    // },
    // tempdata() {
    //   return this.testAnswerList.map((ques) => ({
    //     quesId: ques.id,
    //     echartConfig: this.getEchartConfig(Object.assign({}, ques)),
    //   }));
    // },
  },
  watch: {
    testRefresh: {
      handler(newval) {
        console.log(newval);
        this.getLocallist();
      },

      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.getLocallist();
  },
  methods: {
    getLocallist() {
      this.localList = this.testShowList.map((ques) => ({
        quesId: ques.itemId,
        echartConfig: this.getEchartConfig(ques), //Object.assign({}, ques)
      }));
    },
    getEchartConfig(value) {
      // delete value.id;
      return {
        color: ["#019d96"],
        xAxis: {
          type: "category",
          data: value.xArr, //Object.keys(value),
        },
        yAxis: { type: "value", minInterval: 1 },
        series: [
          {
            data: value.yArr, //Object.values(value),
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

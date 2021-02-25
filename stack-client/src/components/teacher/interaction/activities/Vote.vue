<template>
  <div>
    <h1 class="sign-title">投票结果</h1>
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
    return {
      localList: [],
    };
  },
  computed: {
    ...mapState({
      voteData: (state) => state.student.interaction.vote,
      teacherId: (state) => state.public.studentId,
      teacherName: (state) => state.public.userName,
      voteShowList: (state) => state.teacher.voteShowList,
      voteRefresh: (state) => state.teacher.voteRefresh,
    }),
    emptyShow() {
      return !this.voteShowList.length;
    },
    // tempdata() {
    //   return this.voteShowList.map((ques) => ({
    //     quesId: ques.itemId,
    //     echartConfig: this.getEchartConfig(ques), //Object.assign({}, ques)
    //   }));
    // },
  },
  watch: {
    voteRefresh(val) {
      this.getLocallist();
    },
  },
  mounted() {
    this.getLocallist();
  },
  methods: {
    getLocallist() {
      this.localList = this.voteShowList.map((ques) => ({
        quesId: ques.itemId,
        echartConfig: this.getEchartConfig(ques), //Object.assign({}, ques)
      }));
    },
    getEchartConfig(value) {
      // delete value.id;
      console.log(value);

      return {
        color: ["#019d96"],
        xAxis: {
          type: "category",
          data: value.xArr,
        },
        yAxis: { type: "value", minInterval: 1 },
        series: [
          {
            data: value.yArr,
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

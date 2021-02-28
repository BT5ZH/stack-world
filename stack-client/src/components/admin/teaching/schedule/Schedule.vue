<template>
  <div>
    <a-row>
      <div>
        <schedule-info @courseTableData="getCourseTableData"></schedule-info>
      </div>
    </a-row>
    <a-row class="container">
      <div class="class-card">
        <schedule-table :courseTableData="courseTableData"></schedule-table>
      </div>
    </a-row>
  </div>
</template>

<script>
import ScheduleTable from "./ScheduleTable";
import ScheduleInfo from "./ScheduleInfo";

export default {
  components: { ScheduleTable, ScheduleInfo },
  data() {
    return {
      courseTableData: [],
    };
  },
  methods: {
    getCourseTableData(TableData) {
      this.courseTableData = TableData;
      // console.log("---message---")
      // console.log(TableData)
      // console.log("---courseTableData---")
      // console.log(this.courseTableData)
    },
  },
};
</script>

<style scoped>
.tree,
.class-card {
  height: 100%;
}

.class-card {
  padding: 0 20px;
}

.container {
  padding: 10px;
  height: 100%;
}
</style>

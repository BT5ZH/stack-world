<template>
  <a-row class="container">
    <a-col :span="16" class="class-card">
      <schedule-table :courseTableData="courseTableData"></schedule-table>
    </a-col>
    <a-col :span="8">
      <schedule-info @courseTableData="getCourseTableData"></schedule-info>
    </a-col>
  </a-row>
</template>

<script>
import ScheduleTable from "./ScheduleTable";
import ScheduleInfo from "./ScheduleInfo";

export default {
  components: { ScheduleTable, ScheduleInfo },
  data() {
    return {
      courseTableData: [],
    }
  },
  methods: {
    getCourseTableData(TableData) {
      this.courseTableData = TableData
      // console.log("---message---")
      // console.log(TableData)
      // console.log("---courseTableData---")
      // console.log(this.courseTableData)
    }
  }
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

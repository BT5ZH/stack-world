<template>
  <a-row class="container">
    <a-col :span="3" class="tree">
      <tree></tree>
    </a-col>
    <a-col :span="16" class="class-card">
      <schedule-table></schedule-table>
    </a-col>
    <a-col :span="5">
      <schedule-info></schedule-info>
    </a-col>
  </a-row>
</template>

<script>
import Tree from "./ScheduleTree";
import ScheduleTable from "./ScheduleTable";
import ScheduleInfo from "./ScheduleInfo";

export default {
  components: { Tree, ScheduleTable, ScheduleInfo },
};
</script>

<style scoped>
.tree,
.class-card {
  height: 100%;
  border-right: 2px dashed #ccc;
}

.class-card {
  padding: 0 20px;
}

.container {
  padding: 10px;
  height: 100%;
}
</style>

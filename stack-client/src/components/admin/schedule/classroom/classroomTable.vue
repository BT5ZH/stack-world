<template>
  <a-row class="container">
    <a-col :span="4" class="tree">
      <tree></tree>
    </a-col>
    <a-col :span="19">
      <course-table class="class-table"></course-table>
    </a-col>
  </a-row>
</template>

<script>
import Tree from "./classroomTableTree";
import CourseTable from "./classroomCourseTable";

export default {
  components: { Tree, CourseTable },
};
</script>

<style scoped>
.tree {
  height: 100%;
  border-right: 2px dashed #ccc;
}

.class-table {
  padding-left: 20px;
}

.container {
  padding: 10px;
  height: 100%;
}
</style>

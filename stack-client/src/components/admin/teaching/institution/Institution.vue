<template>
  <a-row class="container">
    <a-col :span="4" class="tree">
      <tree></tree>      
    </a-col>
    <a-col :span="19">
      <class-table class="class-table"></class-table>
    </a-col>
  </a-row>
</template>

<script>
import Tree from "./InstitutionTree";
import ClassTable from "./ClassTable";

export default {
  components: { Tree, ClassTable },
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

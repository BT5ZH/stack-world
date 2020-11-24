<template>
  <a-row class="container">
    <a-col :span="4" class="tree">
      <tree></tree>      
    </a-col>
    <a-col :span="19">
      <space-card class="class-card"></space-card>
    </a-col>
  </a-row>
</template>

<script>
import Tree from "./SpaceTree";
import SpaceCard from "./SpaceCard";

export default {
  components: { Tree, SpaceCard },
};
</script>

<style scoped>
.tree {
  height: 100%;
  border-right: 2px dashed #ccc;
}

.class-card {
  padding-left: 20px;
}

.container {
  padding: 10px;
  height: 100%;
}
</style>

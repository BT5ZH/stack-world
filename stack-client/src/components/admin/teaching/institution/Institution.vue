<template>
  <a-row class="container">
    <a-col :span="4" class="tree">
      <tree></tree>
      <div class="btn-area">
        <a-button-group>
          <a-button type="primary">+ 学院</a-button>
          <a-button type="primary">+ 专业</a-button>
          <a-button type="primary">编辑</a-button>
          <a-button type="primary">删除</a-button>
        </a-button-group>
      </div>
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

.btn-area {
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
}

.class-table {
  padding-left: 20px;
}

.container {
  padding: 10px;
  height: 100%;
}
</style>

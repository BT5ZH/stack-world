<template>
  <a-row class="container">
    <a-col :span="4" class="tree">
      <tree></tree>
      <div class="btn-area">
        <a-button-group>
          <a-button type="primary">+ 楼</a-button>
          <a-button type="primary">+ 层</a-button>
          <a-button type="primary">编辑</a-button>
          <a-button type="primary">删除</a-button>
        </a-button-group>
      </div>
    </a-col>
    <a-col :span="19">
      <class-card class="class-card"></class-card>
    </a-col>
  </a-row>
</template>

<script>
import Tree from "./SpaceTree";
import ClassCard from "./ClassCard";

export default {
  components: { Tree, ClassCard },
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

.class-card {
  padding-left: 20px;
}

.container {
  padding: 10px;
  height: 100%;
}
</style>

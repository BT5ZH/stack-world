<template>
  <a-tree :load-data="onLoadData" :tree-data="treeData" />
</template>

<script>
export default {
  data() {
    return {
      treeData: [
        { title: "陕西师范大学", key: "0" },
        { title: "西安邮电大学", key: "1" },
        { title: "长安大学", key: "2", isLeaf: true },
      ],
    };
  },
  methods: {
    onLoadData(treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        setTimeout(() => {
          treeNode.dataRef.children = [
            { title: "Child Node", key: `${treeNode.eventKey}-0` },
            { title: "Child Node", key: `${treeNode.eventKey}-1` },
          ];
          this.treeData = [...this.treeData];
          resolve();
        }, 1000);
      });
    },
  },
};
</script>

<style>
</style>
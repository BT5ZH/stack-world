<template>
  <div>
    <a-tree
      :load-data="onLoadData"
      :tree-data="treeData"
      :show-line="true"
      @select="onSelect"
      :defaultExpandedKeys="['1']"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      treeData: [
        {
          title: "陕西师范大学",
          key: "1",
          children: [
            {
              title: "计算机科学学院",
              key: "1-1",
              children: [
                { title: "人工智能", key: "1-1-1", isLeaf: true },
                { title: "软件工程", key: "1-1-2", isLeaf: true },
              ],
            },
            { title: "材料科学与工程学院", key: "1-2", isLeaf: true },
          ],
        },
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
        // to request data

        // setTimeout(() => {
        //   treeNode.dataRef.children = [
        //     { title: "Child Node", key: `${treeNode.eventKey}-0` },
        //     { title: "Child Node", key: `${treeNode.eventKey}-1` },
        //   ];
        //   this.treeData = [...this.treeData];
        //   resolve();
        // }, 1000);
      });
    },
    onSelect([selectedKey]) {
      console.log(selectedKey);
    },
  },
};
</script>

<style>
</style>
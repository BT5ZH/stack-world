<template>
  <a-tree :load-data="onLoadData" :tree-data="treeData" :show-line="true" :defaultExpandedKeys="['1']"/>
</template>

<script>
export default {
  data() {
    return {
      treeData: [
        {
          title: "育人学校（61）",
          key: "1",
          children: [
            {
              title: "图书馆（20）",
              key: "0-0",
              children: [
                {
                  title: "1层（11）",
                  key: "0-0-0",
                  children: [
                    { title: "101", key: "0-0-0-0", isLeaf: true },
                    { title: "1003", key: "0-0-0-1", isLeaf: true },
                    { title: "1004", key: "0-0-0-2", isLeaf: true },
                    { title: "1006", key: "0-0-0-3", isLeaf: true },
                  ],
                },
                { title: "2层（2）", key: "0-0-1", isLeaf: true },
                { title: "5层（7）", key: "0-0-2", isLeaf: true },
              ],
            },
            {
              title: "生化楼（22）",
              key: "0-1",
              isLeaf: true,
            },
            {
              title: "多媒体微机室（12）",
              key: "0-2",
              isLeaf: true,
            },
            {
              title: "三教（7）",
              key: "0-3",
              isLeaf: true,
            },
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
  },
};
</script>

<style>
</style>
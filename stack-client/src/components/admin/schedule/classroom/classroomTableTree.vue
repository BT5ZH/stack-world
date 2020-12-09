<template>
  <a-tree
    class="draggable-tree"
    :load-data="onLoadData"
    @select="onSelect"
    :default-expanded-keys="expandedKeys"
    draggable
    :tree-data="DataList"
  />
</template>

<script>
const DataList = [
  {
    title: "育人学校（61）",
    key: "1",
    children: [
      {
        title: "图书馆（20）",
        key: "1-1",
        children: [
          {
            title: "1层（11）",
            key: "1-1-1",
            children: [
              {
                title: "101",
                key: "1-1-1-1",
              },
              {
                title: "103",
                key: "1-1-1-2",
              },
              {
                title: "1004",
                key: "1-1-1-3",
              },
              {
                title: "1006",
                key: "1-1-1-4",
              },
              {
                title: "1007",
                key: "1-1-1-5",
              },
              {
                title: "1008",
                key: "1-1-1-6",
              },
            ],
          },
          {
            title: "2层（2）",
            key: "1-1-2",
            children: [],
          },
          {
            title: "5层（7）",
            key: "1-1-3",
            children: [],
          },
        ],
      },
      {
        title: "生化楼（22）",
        key: "1-2",
        children: [],
      },
      {
        title: "多媒体微机室（12）",
        key: "1-3",
        children: [],
      },
      {
        title: "三教（8）",
        key: "1-4",
        children: [],
      },
    ],
  },
];
export default {
  data() {
    return {
      DataList,
      expandedKeys: ["1", "1-1", "1-1-1"],
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
    onSelect([selectedKey]) {
      console.log(selectedKey);
    },
  },
};
</script>

<style>
</style>
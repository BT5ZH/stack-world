<template>
  <div>
    <a-modal v-model="edit_visible" title="编辑" @ok="editItem">
      <a-input placeholder="名称" v-model="new_edit" />
    </a-modal>

    <a-modal v-model="campus_visible" title="添加校区" @ok="addCampus">
      <a-input placeholder="校区名称" v-model="new_campus" />
    </a-modal>

    <a-modal v-model="building_visible" title="添加教学楼" @ok="addBuilding">
      <a-select
        placeholder="请选择校区"
        @change="handleSelectChange"
        style="width: 100%;margin-bottom: 20px;"
      >
        <a-select-option v-for="item in campusList" :key="item" :value="item">
          {{ item }}
        </a-select-option>
      </a-select>
      <a-input placeholder="教学楼名称" v-model="new_building" />
    </a-modal>

    <a-tree
      :load-data="onLoadData"
      :tree-data="treeData"
      @select="showRooms"
      :show-line="true"
      :defaultExpandedKeys="['1']"
    />
    <div class="btn-area">
      <a-button-group>
        <a-button type="primary" @click="campus_visible = true"
          >+ 校区</a-button
        >
        <a-button type="primary" @click="building_visible = true"
          >+ 教学楼</a-button
        >
        <a-button type="primary" @click="editContent(currentInfo)"
          >编辑</a-button
        >
        <a-button type="primary" @click="deleteContent(currentInfo)"
          >删除</a-button
        >
      </a-button-group>
    </div>
  </div>
</template>

<script>
let temp = [
  {
    title: "育人学校（61）",
    key: "1",
    children: [
      {
        title: "长安校区",
        key: "0-1",
        children: [
          {
            title: "图书馆（20）",
            key: "0-1-0",
            isLeaf: true,
          },
          {
            title: "生化楼（22）",
            key: "0-1-1",
            isLeaf: true,
          },
          {
            title: "多媒体微机室（12）",
            key: "0-1-2",
            isLeaf: true,
          },
          {
            title: "三教（7）",
            key: "0-1-3",
            isLeaf: true,
          },
        ],
      },
      {
        title: "雁塔校区",
        key: "0-2",
        children: [
          {
            title: "图书馆（20）",
            key: "0-2-0",
            isLeaf: true,
          },
          {
            title: "生化楼（22）",
            key: "0-2-1",
            isLeaf: true,
          },
          {
            title: "多媒体微机室（12）",
            key: "0-2-2",
            isLeaf: true,
          },
          {
            title: "三教（7）",
            key: "0-2-3",
            isLeaf: true,
          },
        ],
      },
    ],
  },
];
export default {
  data() {
    return {
      edit_visible: false,
      campus_visible: false,
      building_visible: false,
      new_edit: "",
      new_campus: "",
      new_building: "",
      currentNode: 1,
      currentInfo: {},

      campusList: ["雁塔校区", "长安校区"],
      treeData: [],
    };
  },
  mounted() {},
  methods: {
    onLoadData(treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
      });
    },

    //点击，右边显示不一样的教室数据
    showRooms(selectedKeys, info) {
      console.log(info);
      this.currentNode = selectedKeys;
      this.currentInfo = info.selectedNodes[0].data.props.dataRef;
      //post selectedKeys，获取新的数据，存储到store，在spaceCard处渲染
    },
    //左下角四个模态框
    handleSelectChange(value) {
      console.log(value);
    },
    addCampus() {
      console.log(this.new_campus);
      //post this.new_campus
    },
    addBuilding() {
      console.log(this.new_building);
      //post this.new_building
    },
    editContent(editItem) {
      console.log(editItem);
      !editItem.title
        ? this.$message.info("请选中要编辑的项")
        : ((this.new_edit = this.currentInfo.title),
          (this.edit_visible = true));
    },
    editItem() {
      this.new_edit
        ? this.$message.info("编辑内容不可为空")
        : (console.log(this.new_edit),
          //post this.new_edit
          (this.edit_visible = false));
    },
    deleteContent(deleteItem) {
      console.log(deleteItem);
      !deleteItem.title
        ? this.$message.info("请选中要删除的项")
        : this.$confirm({
            title: "确认删除吗",
            content: "数据删除后不可恢复",
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk() {
              console.log(deleteItem);
              //post deleteItem
            },
            onCancel() {
              console.log("Cancel");
            },
          });
    },
  },
};
</script>

<style scoped>
.btn-area {
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
}
</style>

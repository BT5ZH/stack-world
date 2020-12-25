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
  </div>
</template>

<script>
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

<style scoped></style>

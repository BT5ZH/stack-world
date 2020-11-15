<template>
  <div>
    <a-row class="btn-area">
      <a-col :span="5">
        <a-input-search
          placeholder="课程编号/名称"
          enter-button
          @search="onSearch"
        />
      </a-col>
      <a-col :span="13"></a-col>
      <a-col :span="6" class="btn">
        <a-button type="primary">批量添加课程</a-button>
        <a-button type="primary">添加课程</a-button>
        <a-button type="primary">批量删除</a-button>
      </a-col>
    </a-row>
    <a-table
      rowKey="_id"
      :pagination="{
        total: 50,
        'show-size-changer': true,
        'show-quick-jumper': true,
      }"
      :bordered="true"
      :row-selection="{
        selectedRowKeys: selectedCourses,
        onChange: onSelectChange,
      }"
      :columns="columns"
      :data-source="courseList"
    >
      <template v-slot:operation>
        <a-button type="link">编辑</a-button>
        <a-button type="link">删除</a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        {
          title: "课程编号",
          dataIndex: "_id",
          align: "center",
        },
        {
          title: "课程名称",
          dataIndex: "courseName",
          align: "center",
        },
        {
          title: "所属学院",
          dataIndex: "college",
          align: "center",
        },
        {
          title: "专业",
          dataIndex: "major",
          align: "center",
        },
        {
          title: "编辑",
          align: "center",
          scopedSlots: { customRender: "operation" },
        },
      ],
      selectedCourses: [],
      courseList: [
        {
          _id: "1",
          courseName: "数据结构",
          college: "计算机科学学院",
          major: "软件工程",
        },
        {
          _id: "2",
          courseName: "计算机体系结构",
          college: "计算机科学学院",
          major: "计算机科学与技术",
        },
        {
          _id: "3",
          courseName: "数据科学",
          college: "计算机科学学院",
          major: "软件工程",
        },
      ],
    };
  },
  methods: {
    onSelectChange(selectedKeys) {
      this.selectedCourses = selectedKeys;
    },
    onSearch() {},
  },
};
</script>

<style scoped>
.btn-area {
  padding-bottom: 10px;
}

.btn .ant-btn {
  margin: 0 5px;
}
</style>
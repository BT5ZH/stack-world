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
  props: { courses: { type: Array } },
  data() {
    return {
      courseList: [],
      columns: [
        {
          title: "课程编号",
          dataIndex: "course_id",
          align: "center",
        },
        {
          title: "课程名称",
          dataIndex: "name",
          align: "center",
        },
        {
          title: "所属学院",
          dataIndex: "subOrg_name",
          align: "center",
        },
        {
          title: "专业",
          dataIndex: "major_name",
          align: "center",
        },
        {
          title: "编辑",
          align: "center",
          scopedSlots: { customRender: "operation" },
        },
      ],
      selectedCourses: [],
    };
  },
  watch: {
    courses: {
      immediate: true,
      handler(value) {
        console.log(value);
        this.courseList = value;
      },
    },
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

<template>
  <div>
    <batchAddCourse :visible.sync="bulkImport_visible"></batchAddCourse>
    <a-row class="btn-area">
      <a-col :span="5">
        <a-input-search
          placeholder="课程编号/名称"
          enter-button
          @search="onSearch"
        />
      </a-col>
      <a-col :span="10"></a-col>
      <a-col :span="9" class="btn">
        <a-button type="primary" @click="bulkImport_visible = true"
          >批量添加课程</a-button
        >
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
import batchAddCourse from "./BatchAddCourse.vue";
export default {
  components: { batchAddCourse },
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
          title: "学分",
          dataIndex: "credit",
          align: "center",
        },
        {
          title: "开课学期",
          dataIndex: "semester",
          align: "center",
        },
        {
          title: "周学时",
          dataIndex: "weekly_hrs",
          align: "center",
        },
        {
          title: "实践/实验(学时)",
          dataIndex: "experiment_or_traning_hrs",
          align: "center",
        },
        {
          title: "考核方式",
          dataIndex: "evaluation",
          align: "center",
        },
        {
          title: "课程类型",
          dataIndex: "course_type",
          align: "center",
        },
        {
          title: "开课年级",
          dataIndex: "grade",
          align: "center",
        },
        {
          title: "编辑",
          align: "center",
          scopedSlots: { customRender: "operation" },
        },
      ],
      selectedCourses: [],
      bulkImport_visible: false,
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

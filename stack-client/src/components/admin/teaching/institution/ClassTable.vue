<template>
  <div>
    <a-row class="btn-area">
      <a-col :span="5">
        <a-input-search
          placeholder="班级名称"
          enter-button
          @search="onSearch"
        />
      </a-col>
      <a-col :span="13"></a-col>
      <a-col :span="6" class="btn">
        <a-button type="primary">批量添加班级</a-button>
        <a-button type="primary">添加班级</a-button>
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
        selectedRowKeys: selectedClasses,
        onChange: onSelectChange,
      }"
      :columns="columns"
      :data-source="classList"
    >
      <template v-slot:operation>
        <a-button type="link">详情</a-button>
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
          title: "班级名称",
          dataIndex: "className",
          align: "center",
        },
        {
          title: "学院",
          dataIndex: "college",
          align: "center",
        },
        {
          title: "专业",
          dataIndex: "major",
          align: "center",
        },
        {
          title: "学生数量",
          dataIndex: "studentNum",
          align: "center",
        },
        {
          title: "操作",
          align: "center",
          scopedSlots: { customRender: "operation" },
        },
      ],
      selectedClasses: [],
      classList: [
        {
          _id: "1",
          className: "软工1702",
          college: "计算机科学学院",
          major: "软件工程",
          studentNum: 40,
        },
        {
          _id: "2",
          className: "软工1701",
          college: "计算机科学学院",
          major: "软件工程",
          studentNum: 40,
        },
        {
          _id: "3",
          className: "计创1701",
          college: "计算机科学学院",
          major: "计算机科学与技术（创新实验班）",
          studentNum: 40,
        },
        {
          _id: "4",
          className: "计创1701",
          college: "计算机科学学院",
          major: "计算机科学与技术（创新实验班）",
          studentNum: 40,
        },
      ],
    };
  },
  methods: {
    onSelectChange(selectedKeys) {
      this.selectedClasses = selectedKeys;
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
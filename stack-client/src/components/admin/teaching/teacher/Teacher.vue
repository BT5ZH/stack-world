<template>
  <div class="container">
    <a-row class="btn-area">
      <a-col :span="4">
        <a-input-search
          placeholder="姓名/工号"
          enter-button
          @search="onSearch"
        />
      </a-col>
      <a-col :span="14"></a-col>
      <a-col :span="6" class="btn">
        <a-button type="primary">禁用</a-button>
        <a-button type="primary">启用</a-button>
        <a-button type="primary">注册</a-button>
        <a-button type="primary">批量注册</a-button>
        <a-button type="primary">批量删除</a-button>
      </a-col>
    </a-row>

    <a-row>
      <a-table
        rowKey="_id"
        :pagination="{
          total: 50,
          'show-size-changer': true,
          'show-quick-jumper': true,
        }"
        :bordered="true"
        :row-selection="{
          selectedRowKeys: selectedTeachers,
          onChange: onSelectChange,
        }"
        :columns="columns"
        :data-source="teacherList"
      >
        <template #operation="record">
          <a-button type="link" @click="editTeacher(record)">编辑</a-button>
          <a-button type="link" @click="resetPassword(record)"
            >重置密码</a-button
          >
          <a-button type="link" @click="deleteTeacher(record)">删除</a-button>
        </template>
        <template #state="text">
          <a-tag color="#388e3c" v-if="text"> 已启用</a-tag>
          <a-tag color="#ff5252" v-else> 已禁用</a-tag>
        </template>
      </a-table>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    const columns = [
      {
        title: "账号（工号）",
        dataIndex: "_id",
        align: "center",
      },
      {
        title: "教师姓名",
        dataIndex: "teacherName",
        align: "center",
      },
      {
        title: "所属学院",
        dataIndex: "college",
        align: "center",
      },
      {
        title: "联系方式（手机）",
        dataIndex: "phoneNumber",
        align: "center",
      },
      {
        title: "注册日期",
        dataIndex: "registrationDate",
        align: "center",
      },
      {
        title: "状态",
        dataIndex: "state",
        align: "center",
        scopedSlots: { customRender: "state" },
      },
      {
        title: "操作",
        scopedSlots: { customRender: "operation" },
        align: "center",
      },
    ];
    return {
      columns,
      selectedTeachers: [],
      teacherList: [
        {
          _id: "1048092381",
          teacherName: "张三",
          college: "计算机科学学院",
          phoneNumber: "13333333897",
          registrationDate: "2020-08-10",
          state: true,
        },
        {
          _id: "1048092382",
          teacherName: "李四",
          college: "计算机科学学院",
          phoneNumber: "13333333897",
          registrationDate: "2020-08-10",
          state: false,
        },
        {
          _id: "1048092383",
          teacherName: "王五",
          college: "计算机科学学院",
          phoneNumber: "13333333897",
          registrationDate: "2020-08-10",
          state: true,
        },
      ],
    };
  },
  methods: {
    onSelectChange(keys) {
      this.selectedTeachers = keys;
    },
    onSearch() {},
    deleteTeacher(record) {
      console.log(record);
    },
    editTeacher(record) {
      console.log(record);
    },
  },
};
</script>

<style scoped>
.container {
  padding: 10px;
  height: 100%;
}

.btn-area {
  padding-bottom: 10px;
}

.btn .ant-btn {
  margin: 0 5px;
}
</style>
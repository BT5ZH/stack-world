<template>
  <div align="center" class="grade">
    <a-row class="btn-area">
      <a-col :span="2">
        <a-button type="link" @click="backward">
          <a-icon type="left" />返回
        </a-button>
      </a-col>
      <a-col :span="6"> </a-col>
      <a-col :span="6">
        <b>{{ class_name }}</b>
      </a-col>
    </a-row>
    <a-row class="btn-area">
      <a-col :span="2"> </a-col>
      <a-col :span="12"></a-col>
      <a-col :span="9" class="btn">
        <a-button type="primary" @click="add_student">添加学生</a-button>
        <a-button type="primary" disabled>批量删除学生</a-button>
      </a-col>
    </a-row>
    <a-table
      rowKey="_id"
      :columns="columns"
      :data-source="data"
      bordered
      :row-selection="{
        selectedRowKeys: selectedClasses,
        onChange: onSelectChange,
      }"
      :pagination="{
        total: 50,
        'show-size-changer': true,
        'show-quick-jumper': true,
      }"
      class="table_set"
    >
      <template v-for="col in ['name', 'user_id', 'phone']" :slot="col">
      </template>
      <template #operation="record">
        <a-button type="link" @click="deleteStudent(record)">删除</a-button>
      </template>
    </a-table>
    <!-- 添加学生对话框 -->
    <a-modal
      v-model="visible"
      title="添加"
      @ok="addstudent_ok"
      :maskClosable="false"
    >
      <add_students></add_students>
    </a-modal>
  </div>
</template>

<script>
import add_students from "./add_students";
import axios from "@/utils/axios";

const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    align: "center",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "学号",
    dataIndex: "user_id",
    align: "center",
    scopedSlots: { customRender: "user_id" },
  },
  {
    title: "电话",
    dataIndex: "phone",
    align: "center",
    scopedSlots: { customRender: "phone" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    scopedSlots: { customRender: "operation" },
  },
];
const data = [];
export default {
  components: { add_students },
  data() {
    this.cacheData = data.map((item) => ({ ...item }));
    return {
      // 初始数据
      data,
      columns,
      editingKey: "",
      class_name: "",
      // 添加学生
      visible: false,
      // 多选键
      selectedClasses: [],
    };
  },
  mounted() {
    // 显示班名
    this.class_name = this.$route.query.class_name;
    this.getStudents();
  },
  methods: {
    async getStudents() {
      // 获取所有学生名
      const class_id = this.$route.query.classId;
      const url = "/pc/v1/classes/" + class_id;
      try {
        const { data } = await axios.get(url);
        this.data = data.data.classEntity.studentList;
        // console.log(data.data.classEntity.studentList);
      } catch (err) {
        console.log(err);
      }
    },

    backward() {
      // 返回
      this.$router.push({
        name: "admin_institution",
      });
    },
    onSearch() {},
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    onDelete(key) {
      const data = [...this.data];
      this.data = data.filter((item) => item.key !== key);
    },
    // 多选键
    onSelectChange(selectedKeys) {
      // 表格信息的选中
      this.selectedClasses = selectedKeys;
    },
    // 添加学生
    add_student() {
      this.visible = true;
    },
    addstudent_ok() {},
    // 删除学生
    deleteStudent(record) {
      console.log(record);
    },
  },
};
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.table_set {
  margin: 10px 50px;
}
.grade {
  margin: 10px 0 0 0;
  font-size: 18px;
}
.btn-area {
  padding-bottom: 10px;
}
.btn .ant-btn {
  margin: 0 5px;
}
</style>
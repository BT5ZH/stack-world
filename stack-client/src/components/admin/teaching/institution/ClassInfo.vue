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
    <a-spin :spinning="spin_status" tip="Loading...">
      <a-table
        rowKey="user_id"
        :bordered="true"
        :row-selection="{
          selectedRowKeys: selectedClasses,
          onChange: onSelectChange,
        }"
        :pagination="{
          total: 50,
          'show-size-changer': true,
          'show-quick-jumper': true,
        }"
        :columns="columns"
        :data-source="data"
      >
        <!-- <template v-for="col in ['name', 'user_id', 'phone']" :slot="col">
        </template> -->
        <template #operation="record">
          <a-button type="link" @click="deleteStudent(record)">删除</a-button>
        </template>
      </a-table>
    </a-spin>
    <!-- 添加学生对话框 -->
    <a-modal
      v-model="visible"
      title="添加"
      @ok="addstudent_ok"
      :maskClosable="false"
    >
      <add_students @refresh="parent_refresh" :child_refresh="refresh"></add_students>
    </a-modal>
  </div>
</template>

<script>
import add_students from "./add_students";
import axios from "@/utils/axios";
import { mapState } from "vuex";

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
      refresh: 1,
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
  computed: {
    ...mapState({
      Tree_spin_status: (state) => state.admin.Tree_spin_status,
      spin_status: (state) => state.admin.spin_status,
    }),
  },
  mounted() {
    // 显示班名
    this.class_name = this.$route.query.class_name;
    this.getStudents();
  },
  watch: {
    refresh(val) {
      this.getStudents();
    },
  },
  methods: {
    parent_refresh(ss) {
      this.refresh += ss;
    },
    async getStudents() {
      // 获取所有学生名
      const class_id = this.$route.query.classId;
      const url = "/pc/v1/classes/" + class_id;
      try {
        this.$store.dispatch("admin/change_spin_status", true);
        const { data } = await axios.get(url);
        this.$store.dispatch("admin/change_spin_status", false);
        this.data = data.data.classEntity.studentList;
        console.log("---data---");
        console.log(data);
        // console.log(data.data.classEntity.studentList);
      } catch (err) {
        this.$store.dispatch("admin/change_spin_status", false);
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
    addstudent_ok() {
      this.visible = false;
    },
    // 删除学生
    async deleteStudent(record) {
      try {
        const url = "/pc/v1/classes/" + this.$route.query.classId;
        let payload = { students: [record._id] };
        let data = await axios.post(url, payload);
        this.refresh += 1;
        this.$message.info("删除成功");
      } catch (err) {
        this.$message.error("删除失败");
        console.log(err);
      }
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

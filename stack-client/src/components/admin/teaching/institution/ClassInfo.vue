<template>
  <div align="center" class="grade">
    <a-row class="btn-area">
      <a-col :span="2">
        <a-button type="link" @click="backward">
          <a-icon type="left" />Backward
        </a-button>
      </a-col>
      <a-col :span="6"> </a-col>
      <a-col :span="6">
        <b>班级详情</b>
      </a-col>
    </a-row>
    <a-row class="btn-area">
      <a-col :span="2"> </a-col>
      <a-col :span="6">
        <a-input-search
          placeholder="学生名称"
          enter-button
          @search="onSearch"
        />
      </a-col>
      <a-col :span="6"></a-col>
      <a-col :span="9" class="btn">
        <a-button type="primary">添加学生</a-button>
        <a-button type="primary">批量删除学生</a-button>
      </a-col>
    </a-row>
    <a-table
      rowKey="_id"
      :columns="columns"
      :data-source="data"
      bordered
      :pagination="{
        total: 50,
        'show-size-changer': true,
        'show-quick-jumper': true,
      }"
      class="table_set"
    >
      <template
        v-for="col in ['name', 'student_id', 'class_id', 'sex']"
        :slot="col"
        slot-scope="text, record"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="(e) => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.key)">保存</a>
            <a-popconfirm
              title="确定取消吗?"
              @confirm="() => cancel(record.key)"
            >
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a :disabled="editingKey !== ''" @click="() => edit(record.key)">
              <a href="javascript:;">编辑</a>
            </a>
            <a-popconfirm
              v-if="data.length"
              title="确定删除吗?"
              @confirm="() => onDelete(record.key)"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
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
    dataIndex: "student_id",
    align: "center",
    scopedSlots: { customRender: "student_id" },
  },
  {
    title: "班级",
    dataIndex: "class_id",
    align: "center",
    scopedSlots: { customRender: "class_id" },
  },
  {
    title: "性别",
    dataIndex: "sex",
    align: "center",
    scopedSlots: { customRender: "sex" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    scopedSlots: { customRender: "operation" },
  },
];
const data = [
  {
    key: "1",
    name: "张三",
    student_id: "172001",
    class_id: "软工1702",
    sex: "男",
  },
  {
    key: "2",
    name: "李四",
    student_id: "172002",
    class_id: "软工1702",
    sex: "男",
  },
  {
    key: "3",
    name: "王五",
    student_id: "172003",
    class_id: "软工1702",
    sex: "男",
  },
  {
    key: "4",
    name: "李莉",
    student_id: "172004",
    class_id: "软工1702",
    sex: "女",
  },
];
export default {
  data() {
    this.cacheData = data.map((item) => ({ ...item }));
    return {
      data,
      columns,
      editingKey: "",
    };
  },
  mounted() {
    this.getStudents();
  },
  methods: {
    async getStudents() {
      // 获取所有学生名
      // 通过id得到班级
      const class_id = this.$route.query.classId;
      let class_result = this.getClass(class_id);
      class_result.then((res) => {
        // 通过班级得到所有学生id，并组装成对象
        let students = [];
        for (let i = 0; i < res.length; i++) {
          students.push({ _id: res[i] });
        }
        let user_result = this.getUsers(students);
        user_result.then(res => {
          console.log(res)
        })
        // console.log(students);
      });

      // 发送给后端，查询出所有user学生
      // const url = "/pc/v1/organizations/" + orgId + "/suborgs";
      // try {
      //   const { data } = await axios.get(url);
      //   this.colleges = data.subOrgs;
      // } catch (err) {
      //   console.log(err);
      // }
    },
    async getClass(class_id) {
      // 获取id对应班级信息
      // console.log(class_id)
      const url = "/pc/v1/classes/" + class_id;
      try {
        const { data } = await axios.get(url);
        return data.data.classEntity.students;
        // console.log(data.data.classEntity.students);
      } catch (err) {
        console.log(err);
      }
    },
    async getUsers(payload) {
      // 获取id对应班级信息
      console.log(payload);
      const url = "/pc/v1/users/getstudents";
      try {
        const { data } = await axios.post(url, payload);
        // return data.data.classEntity.students;
        console.log(data.data);
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
    edit(key) {
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.filter((item) => key === item.key)[0];
      const targetCache = newCacheData.filter((item) => key === item.key)[0];
      if (target && targetCache) {
        delete target.editable;
        this.data = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = "";
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = "";
      if (target) {
        Object.assign(
          target,
          this.cacheData.filter((item) => key === item.key)[0]
        );
        delete target.editable;
        this.data = newData;
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
<template>
  <div>
    <div style="margin-bottom: 16px">
      <a-button
        type="primary"
        :disabled="!hasSelected"
        :loading="loading"
        @click="add_students"
      >
        添加
      </a-button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `Selected ${selectedRowKeys.length} items` }}
        </template>
      </span>
    </div>
    <a-table
      rowKey="_id"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :columns="columns"
      :data-source="data"
    />
  </div>
</template>
<script>
import axiosInstance from "@/utils/axios";

const columns = [
  {
    title: "学号",
    dataIndex: "user_id",
  },
  {
    title: "姓名",
    dataIndex: "name",
  },
];

const data = [];

export default {
  data() {
    return {
      child_refresh: 1,
      data,
      columns,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      users: ["1"],
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  mounted() {
    this.getStudents();
  },
  watch: {
    child_refresh(val) {
      this.getStudents();
    },
  },
  methods: {
    // 添加学生
    add_students() {
      // console.log("come")
      // console.log("---data----")
      // console.log(this.data);
      setTimeout(() => {
        // 开始
        const url = "/pc/v1/classes/updateStudents";
        const requestdata = {
          class_id: this.$route.query.classId,
          students: this.selectedRowKeys,
        };
        // console.log(requestdata)
        axiosInstance
          .patch(url, requestdata)
          .then((res) => {
            // console.log(res);
            this.$message.info("添加成功");
            this.child_refresh += 1;
            this.$emit('refresh',this.child_refresh)
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("添加失败");
          });
        // 结束
        this.loading = false;
        this.selectedRowKeys = [];
      }, 1000);
    },
    async getStudents() {
      // 按要求获取user
      let queryString =
        "?org_name=" +
        this.$route.query.orgName +
        "&subOrg_name=" +
        this.$route.query.subOrg_name +
        "&major_name=" +
        this.$route.query.major_name +
        "&class_id=" +
        this.$route.query.classId;
      // console.log(queryString);
      const url = "/pc/v1/classes/getStudentsNotInOneClass/" + queryString;
      try {
        const { data } = await axiosInstance.get(url);
        console.log("-----students_data------");
        console.log(data.result);
        this.data = data.result;
        // this.users = this.data.map(item=> {
        //   return item.user_id
        // })
        // console.log("----users----")
        // console.log(this.users)
      } catch (err) {
        console.log(err);
      }
    },
    onSelectChange(selectedRowKeys) {
      // console.log("selectedRowKeys changed: ", selectedRowKeys);
      // let a = selectedRowKeys.pop()
      // console.log("a:"+a);
      this.selectedRowKeys = selectedRowKeys;
    },
  },
};
</script>

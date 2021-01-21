<template>
  <div>
    <a-modal
      v-model="modalVisible"
      title="添加学生"
      okText="添加"
      @ok="add_students"
      :disabled="!hasSelected"
      :loading="loading"
    >
      <div style="margin-bottom: 16px">
        <!-- <a-button
          type="primary"
          :disabled="!hasSelected"
          :loading="loading"
          @click="add_students"
        >
          添加
        </a-button> -->
        <span style="margin-left: 8px">
          <template v-if="hasSelected">
            {{ `Selected ${selectedRowKeys.length} items` }}
          </template>
        </span>
      </div>
      <a-spin :spinning="spin_status" tip="Loading...">
        <a-table
          rowKey="_id"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          :columns="columns"
          :data-source="data"
        />
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import axiosInstance from "@/utils/axios";
import { mapState } from "vuex";

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
  props: {
    father_refresh: {
      type: Number,
      default: 0,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modalVisible: false,
      child_refresh: 0,
      data,
      columns,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      users: ["1"],
    };
  },
  computed: {
    ...mapState({
      spin_status: (state) => state.admin.spin_status,
    }),
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  mounted() {
    this.getStudents();
  },
  watch: {
    visible(val) {
      this.modalVisible = val;
    },
    father_refresh(val) {
      this.getStudents();
    },
    child_refresh(val) {
      this.getStudents();
    },
  },
  methods: {
    // 添加学生
    add_students() {
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
          this.$emit("refresh", this.child_refresh);
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("添加失败");
        });
      // 结束
      this.loading = false;
      this.selectedRowKeys = [];
    },
    cancelModal() {
      this.modalVisible = false;
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
        this.$store.dispatch("admin/change_spin_status", true);
        const { data } = await axiosInstance.get(url);
        // console.log(this.spin_status)
        this.$store.dispatch("admin/change_spin_status", false);
        // console.log("-----students_data------");
        // console.log(data.result);
        this.data = data.result;
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

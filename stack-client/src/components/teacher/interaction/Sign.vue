<template>
  <a-row>
    <a-col :span="12" :push="6">
      <h1 class="sign-title">签到结果</h1>
      <a-table :columns="columns" :data-source="signList" rowKey="studentId">
      </a-table>
    </a-col>
  </a-row>
</template>

<script>
import * as socket from "@/utils/socket";
import { mapState } from "vuex";

export default {
  data() {
    const columns = [
      {
        title: "姓名",
        dataIndex: "studentName",
        key: "address",
      },
      {
        title: "班级",
        dataIndex: "className",
      },
      {
        title: "学号",
        dataIndex: "studentId",
      },
    ];
    return { columns };
  },
  computed: {
    ...mapState({
      signList: (state) => state.teacher.signList,
    }),
    lessonId() {
      return this.$route.query.lessonId;
    },
  },
  methods: {},
  mounted() {
    socket.createInstance("teacher", this, this.lessonId);
  },
};
</script>

<style scoped>
.sign-title {
  font-weight: bold;
  color: #bbb;
  text-align: center;
  padding: 20px 0;
}
</style>
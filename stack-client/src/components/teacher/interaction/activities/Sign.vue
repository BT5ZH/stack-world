<template>
  <a-row>
    <a-col :span="18" :push="3">
      <h1 class="sign-title">签到结果</h1>
      <a-table
        :columns="columns"
        :data-source="signList"
        rowKey="studentId"
        :pagination="{
          total: 50,
          'show-size-changer': true,
          'show-quick-jumper': true,
        }"
      >
      </a-table>
    </a-col>
  </a-row>
</template>

<script>
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
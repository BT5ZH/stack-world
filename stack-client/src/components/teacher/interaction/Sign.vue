<template>
  <a-row>
    <a-col :span="12" :push="6">
      <h1 class="sign-title">签到结果</h1>
      <a-table :columns="columns" :data-source="userList"> </a-table>
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
        dataIndex: "address",
        key: "address",
      },
      {
        title: "班级",
        dataIndex: "class",
      },
      {
        title: "学号",
        dataIndex: "number",
      },
    ];
    return {
      columns,
      userList: [],
    };
  },
  computed: {
    ...mapState({
      signList: (state) => state.teacher.signList,
    }),
  },
  methods: {},
  mounted() {
    socket.createInstance(this, {
      sign: (data) => {
        console.log(data);
        // TODO integrate data into mutation params
        this.$store.commit("teacher/updateSignResult");
      },
    });
  },
};
</script>

<style scoped>
.sign-title {
  font-weight: bold;
  color: #BBB;
  text-align: center;
  padding: 20px 0;
}
</style>
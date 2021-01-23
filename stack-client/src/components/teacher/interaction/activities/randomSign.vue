<template>
  <a-row>
    <a-col :span="18" :push="3">
      <h1 class="sign-title">随机点名结果</h1>
      <div v-if="randomStudent != undefined">
        <div class="randomStudent">抽到学生:&nbsp;{{ randomStudent }}</div>
      </div>
      <br />
      <a-table
        :columns="columns"
        :data-source="randomList"
        rowKey="studentId"
        :pagination="{
          total: randomList.length,
          'show-size-changer': true,
          'hide-on-single-page': true,
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
  mounted() {
    console.log(this.randomStudent != undefined);
    console.log("this.randomStudent");
    console.log(this.randomStudent);
  },
  computed: {
    ...mapState({
      randomList: (state) => state.teacher.randomList,
      randomStudent: (state) => state.teacher.randomStudent,
    }),
  },
};
</script>

<style scoped>
.randomStudent {
  font-weight: bold;
}
.sign-title {
  font-weight: bold;
  color: #bbb;
  text-align: center;
  padding: 20px 0;
}
</style>
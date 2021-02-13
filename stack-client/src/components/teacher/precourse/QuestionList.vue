<template>
  <a-row>
    <a-row class="table-area">
      <a-table
        :columns="columns"
        :data-source="tableData"
        bordered
        :pagination="{
          total: tableData.length,
          pageSize: 10,
          'hide-on-single-page': true,
          'show-quick-jumper': true,
        }"
        rowKey="index"
      >
        <template #stem="record">
          <span>
            {{ record.stem_type === "wenzi" ? record.statement.stem : "图片" }}
          </span>
        </template>
        <template #grade="grade">
          <a-tag color="#87d068" v-if="grade === 1">简单</a-tag>
          <a-tag color="#2db7f5" v-else-if="grade === 2">适中</a-tag>
          <a-tag color="#f50000" v-else>困难</a-tag>
        </template>
        <template #question_type="type">
          <span>
            {{ type === 1 ? "主观题" : type === 2 ? "单选题" : "多选题" }}
          </span>
        </template>
        <template #key_word="key_word">
          <a-tag v-for="(item, index) in key_word" :key="index" color="#2db7f5">
            {{ item }}
          </a-tag>
        </template>
        <template #knowledge="knowledge">
          <a-tag
            v-for="(item, index) in knowledge"
            :key="index"
            color="#87d068"
          > 
            {{ item }}
          </a-tag>
        </template>
        <template #operation="record">
          <a-button type="link" @click="viewQuestion(record)">查看</a-button>
        </template>
      </a-table>
    </a-row>
  </a-row>
</template>

<script>
export default {
  data() {
    const columns = [
      {
        title: "序号",
        dataIndex: "index",
        align: "center",
        width: 80,
      },
      {
        title: "题目",
        align: "left",
        scopedSlots: { customRender: "stem" },
       // ellipsis: true,
        width: "30%",
      },
      {
        title: "难度",
        dataIndex: "grade",
        scopedSlots: { customRender: "grade" },
        align: "center",
        width: 80,
      },
      {
        title: "题型",
        dataIndex: "question_type",
        scopedSlots: { customRender: "question_type" },
        align: "center",
        width: 80,
      },
      {
        title: "关键字",
        dataIndex: "key_word",
        scopedSlots: { customRender: "key_word" },
        align: "center",
      },
      {
        title: "知识点",
        dataIndex: "knowledge",
        scopedSlots: { customRender: "knowledge" },
        align: "center",
      },
      {
        title: "分析",
        dataIndex: "analysis",
        align: "center",
      },
      // {
      //   title: "操作",
      //   align: "center",
      //   scopedSlots: { customRender: "operation" },
      // },
    ];
    return {
      columns,
      inputValue: "",
      addVisible: false,
    };
  },
  watch: {
    refresh() {
      const lesson_id = this.$route.query.lessonId;
      const teacher_id = this.$store.state.public.uid;
      this.$store.dispatch("teacher/getquestionBank", {
        lesson_id,
        teacher_id,
      });
    },
  },
  computed: {
    refresh(){
      if(this.$route.query.addQuestion_refresh) return this.$route.query.addQuestion_refresh;
      else return 0;
    },
    questionBank() {
      return this.$store.state.teacher.questionBank;
    },
    tableData() {
      if (!this.questionBank) return [];
      let temp = this.questionBank.map((item, index) => ({
        index: index + 1,
        grade: item.grade,
        question_type: item.question_type,
        key_word: item.key_word,//.split(" "),
        knowledge: item.knowlege,//.split(" "),
        // TODO 把 knowlege 改为 knowledge
        analysis: item.analysis,
        statement: item.statement,
        stem_type: item.stem_type,
      }));
      if (!this.inputValue) return temp;
      return temp.filter(
        (item) =>
          item.key_word.some((key) => key.includes(this.inputValue)) ||
          item.knowledge.some((tag) => tag.includes(this.inputValue))
      );
    },
  },
  methods: {},
  mounted() {
    const lesson_id = this.$route.query.lessonId;
    const teacher_id = this.$store.state.public.uid;
    this.$store.dispatch("teacher/getquestionBank", { lesson_id, teacher_id });
  },
};
</script>

<style scoped>
.table-area {
  margin-top: 20px;
}
</style>
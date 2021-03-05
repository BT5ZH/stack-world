<template>
  <div>
    <a-row>
      <a-row class="table-area">
        <a-table
          :columns="columns"
          :data-source="tableData"
          bordered
          :pagination="{
            total: tableData.length,
            pageSize: 5,
            'hide-on-single-page': true,
            'show-quick-jumper': true,
          }"
          :row-selection="{
            selectedRowKeys: selectedQues,
            onChange: onSelectChange,
          }"
          rowKey="id"
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
            <a-tag v-for="(item, index) in knowledge" :key="index" color="#87d068">
              {{ item }}
            </a-tag>
          </template>
          <template #operation="record">
            <a-button type="link" @click="viewQuestion(record)">查看</a-button>
          </template>
        </a-table>
      </a-row>
    </a-row>
    <br />
    <a-button class="generate-paper" @click="reset"> 重 置</a-button>&nbsp;&nbsp;
    <a-button type="primary" @click="generatePaper">创建试卷</a-button>
    <br /><br />
    <div v-show="paperVisible" class="paper-elements">
      <a-input
        class="paper-title-size"
        v-model="paperTitle"
        placeholder="请输入试卷标题..."
      ></a-input>
      &nbsp;
      <a-input
        class="paper-duration-size"
        v-model="paperDuration"
        placeholder="请输入考试时长(分钟),默认值为30"
      ></a-input>
      &nbsp;&nbsp;
      <a-date-picker
        show-time
        placeholder="选择提交截止日期"
        @change="onChange"
        @ok="onOk"
      />&nbsp;&nbsp;
      <a-button type="danger" @click="submit">提交</a-button>
    </div>
    <paper-list :child_refresh="paperRefresh"></paper-list>
  </div>
</template>

<script>
import moment from "moment";
import axios from "@/utils/axios";
import PaperList from "./PaperList.vue";
export default {
  components: { PaperList },

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
      // {
      //   title: "分析",
      //   dataIndex: "analysis",
      //   align: "center",
      // },
      // {
      //   title: "操作",
      //   align: "center",
      //   scopedSlots: { customRender: "operation" },
      // },
    ];
    return {
      columns,
      paperRefresh: 0,
      inputValue: "",
      addVisible: false,
      selectedQues: [],
      paperVisible: false,
      paperTitle: "",
      paperDuration: "",
      deadLine: "", //moment().add("days", 5).format("YYYY-MM-DD HH:MM"),
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
    paperRefresh(val) {},
  },
  computed: {
    refresh() {
      if (this.$route.query.addQuestion_refresh)
        return this.$route.query.addQuestion_refresh;
      else return 0;
    },
    questionBank() {
      return this.$store.state.teacher.questionBank;
    },
    tableData() {
      if (!this.questionBank) return [];
      let temp = this.questionBank.map((item, index) => ({
        id: item._id,
        index: index + 1,
        grade: item.grade,
        question_type: item.question_type,
        key_word: item.key_word, //.split(" "),
        knowledge: item.knowlege, //.split(" "),
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
  methods: {
    moment,
    reset() {
      this.selectedQues = [];
    },
    generatePaper() {
      if (this.selectedQues.length === 0) this.$message.error("请先选择试题");
      else {
        this.paperVisible = true;
      }
    },
    submit() {
      if (this.paperTitle === "" || this.deadLine === "")
        this.$message.error("请输入试卷标题和截止日期");
      else {
        let duration = Number.parseInt(this.paperDuration);
        if (isNaN(duration) === true) duration = 30;

        axios
          .post("pc/v1/questions/paper", {
            lesson_id: this.$route.query.lessonId,
            title: this.paperTitle,
            deadline: this.deadLine,
            questions: this.selectedQues,
            duration: duration,
          })
          .then(({ data }) => {
            if (data.status === "success") {
              this.$message.success("试卷创建成功");
              //this.$emit("update:visible", false);
              // this.$router.push({
              //   query: {
              //     ...this.$route.query,
              ++this.paperRefresh;
              this.paperVisible = false;
              //   },
              // });
            }
          })
          .catch((err) => {
            console.error(err);
            this.$message.error("试卷创建失败");
          });
      }
    },

    // 表格选择
    onSelectChange(selectedKeys) {
      // 表格信息的选中
      this.selectedQues = selectedKeys;
      console.log(this.selectedQues);
    },

    onChange(value, dateString) {
      console.log("Selected Time: ", value);
      console.log("Formatted Selected Time: ", dateString);
      this.deadLine = moment(dateString).format("YYYY-MM-DD HH:MM");
    },
    onOk(value) {
      console.log("onOk: ", value);
    },
  },
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
.generate-paper {
  margin-left: 85%;
}
.paper-title-size {
  width: 500px;
}
.paper-elements {
  margin-left: 10%;
  margin-top: 10px;
}
.paper-duration-size {
  width: 250px;
}
</style>

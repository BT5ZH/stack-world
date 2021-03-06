<template>
  <a-modal
    class="backbody"
    :visible="visible"
    title="试题信息"
    @ok="handleOk"
    width="60%"
    @cancel="handleOk"
  >
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
            {{ record.statement.stem }}
          </span>
        </template>
        <!-- <template #grade="grade">
          <a-tag color="#87d068" v-if="grade === 1">简单</a-tag>
          <a-tag color="#2db7f5" v-else-if="grade === 2">适中</a-tag>
          <a-tag color="#f50000" v-else>困难</a-tag>
        </template>
        <template #question_type="type">
          <span>
            {{ type === 1 ? "主观题" : type === 2 ? "单选题" : "多选题" }}
          </span>
        </template> -->
      </a-table>
    </a-row>
  </a-modal>
</template>

<script>
import axios from "@/utils/axios";
import { mapState, mapGetters } from "vuex";
const sources = [];
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    paper_id: {
      type: String,
      required: true,
    },
    paper_ques_refresh: {
      type: Number,
      default: 0,
    },
    queStems: {
      type: String,
      required: true,
    },
  },
  data() {
    const columns = [
      {
        title: "序号",
        dataIndex: "index",
        align: "center",
        width: "10%",
      },
      {
        title: "题 目",
        align: "left",
        dataIndex: "stem",
        //scopedSlots: { customRender: "stem" },
        // ellipsis: true,
        width: "70%",
      },
      // {
      //   title: "难度",
      //   dataIndex: "grade",
      //   scopedSlots: { customRender: "grade" },
      //   align: "center",
      //   width: 80,
      // },
      // {
      //   title: "题型",
      //   dataIndex: "question_type",
      //   scopedSlots: { customRender: "question_type" },
      //   align: "center",
      //   width: 80,
      // },
    ];
    return {
      refresh: 0,
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
      quesForm: {
        title: "",
        type: 2,
        content: "",
      },

      optionLength: 2,
      columns,
      inputVisible: false,
      inputValue: "",
      localVisible: false,
    };
  },
  computed: {
    lesson_id() {
      return this.$route.query.lessonId;
    },

    tableData() {
      // if (!this.$store.state.teacher.questionOfPaper) return [];
      // let temp = this.$store.state.teacher.questionOfPaper.map((item, index) => ({
      //   //id:item._id,
      //   index: index + 1,
      //   grade: item.grade,
      //   question_type: item.question_type,
      //   stem: item.stem,
      // }));
      // return temp;
      if (!this.queStems) return [];
      let temp = this.queStems.split("$$");

      temp = temp.map((item, index) => ({
        index: index + 1,
        stem: item,
      }));

      return temp;
    },
  },
  // watch: {
  //   paper_ques_refresh(val) {
  //      let paper_id = this.paper_id;
  //      this.$store.dispatch("teacher/getquestionBankByPaperID", { paper_id });
  //   },
  // },
  methods: {
    onOk(value) {
      console.log("onOk: ", value);
    },
    handleOk() {
      this.$emit("update:visible", false);
      //this.$store.state.teacher.questionOfPaper=[]
    },
  },
  mounted() {
    // let paper_id = this.paper_id;
    // console.log("-----------------------");
    // console.log(paper_id);
    // if(paper_id!="")
    //     this.$store.dispatch("teacher/getquestionBankByPaperID", { paper_id });
  },
};
</script>

<style scoped>
.options {
  padding-left: 30px;
  position: relative;
  right: 10px;
  margin-bottom: 20px;
}

.backbody {
  position: relative;
  z-index: 1;
}
</style>

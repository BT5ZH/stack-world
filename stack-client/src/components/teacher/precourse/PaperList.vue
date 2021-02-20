<template>
  <a-row>
    <a-row class="table-area">
      <a-table
        :columns="columns"
        :data-source="paperList"
        bordered
        :pagination="{
          total: paperList.length,
          pageSize: 3,
          'hide-on-single-page': true,
          'show-quick-jumper': true,
        }"
        
        rowKey="paper_id"
      >
        <template #operation="record">
          <a-button type="link" @click="viewQuesInfo(record)">详情</a-button>
          <a-button type="link" @click="deletePaper(record)">删除</a-button>
        </template>
      </a-table>
    </a-row>
    <div>
      <show-questions 
        :paper_ques_refresh="pqfresh" 
        :visible.sync="showques_visible" 
        :paper_id="paper_id"
        :queStems="questions"
        >
      </show-questions>
    </div>
  </a-row>
  
</template>

<script>
import { mapState } from "vuex";
import axiosInstance from "@/utils/axios";
import ShowQuestions from './ShowQuestions.vue';
export default {
  components: { ShowQuestions },
  props: {
    child_refresh: {
      type: Number,
      default: 0,
    },
  },
  data() {
    const columns = [
      {
        title: "序号",
        dataIndex: "index",
        align: "center",
        width: 80,
      },
      {
        title: "试卷标题",
        align: "center",
        dataIndex: "title",
        //ellipsis: true,
        width: "30%",
      },
      {
        title: "时长(分钟)",
        dataIndex: "duration",
        align: "center",
        width: "10%",
      },
      {
        title: "截止时间",
        dataIndex: "deadline",
        align: "center",
        width: "15%",
      },
      {
        title: "题目数量",
        dataIndex: "questionNum",
        align: "center",
      },
      {
        title: "操作",
        align: "center",
        scopedSlots: { customRender: "operation" },
      },
    ];
    return {
      columns,
      inputValue: "",
      //addVisible: false,
      selectedPaper: [],
      del_refresh: 0,
      showques_visible:false,
      paper_id:"",
      questions:"",
      pqfresh:0
    };
  },
  computed: {
    add_refresh() {
      if (this.$route.query.add_Refresh) return this.$route.query.add_Refresh;
      else return 0;
    },
    questionBank() {
      return this.$store.state.teacher.questionBank;
    },
    paperList() {
      let temp = this.$store.state.teacher.updatePapers;
      if (!temp) return [];
    
      temp = temp.map((item, index) => ({
        index: index + 1,
        ...item
      }));
      return temp;
    },
  },
  watch: {
    del_refresh(val) {
      this.loadPapers();
    },
    child_refresh(val) {
      this.loadPapers();
    },
  },
  methods: {
    // onSelectChange(selectedKey) {
    //   console.log("+++old = "+this.selectedPaper)
    //   this.selectedPaper = selectedKey;
    //   console.log("+++new = "+this.selectedPaper)
    // },
    async loadPapers() {
      const lesson_id = this.$route.query.lessonId;
      this.$store.dispatch("teacher/getPapersByLessonID", { lesson_id });
    },
    async viewQuesInfo(record){
      this.paper_id = record.paper_id;
      this.questions=record.questions[0]+"$$";
      for(let i=1;i<record.questions.length;i++){
          this.questions = this.questions+record.questions[i]+"$$";
      }
      this.questions = this.questions.slice(0,this.questions.length-2)
 
      this.pqfresh=this.pqfresh+1;
      //console.log("***fatther paperid---:"+this.paper_id);
      this.showques_visible=true  
    },
    async deletePaper(record) {
      await this.showDeleteConfirm(record.paper_id);
    },
    showDeleteConfirm(id) {
      var that = this;
      this.$confirm({
        title: "确认删除吗",
        content: "数据删除后不可恢复",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        async onOk() {
          const url = "/pc/v1/questions/paper/" + id;
          try {
            await axiosInstance.delete(url);
            that.$message.info("删除成功！");
            that.del_refresh += 1;
          } catch (err) {
            console.log(err);
            that.$message.error("删除失败，请重试！");
          }
        },
        onCancel() {
          // console.log("Cancel");
        },
      });
    },
  },
  mounted() {
    // const lesson_id = this.$route.query.lessonId;
    // this.$store.dispatch("teacher/getSetHomeworksByLessonID", { lesson_id});
    this.loadPapers();
  },
};
</script>

<style scoped>
.table-area {
  margin-top: 20px;
}
</style>
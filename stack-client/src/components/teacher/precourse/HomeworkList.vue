<template>
  <a-row>
    <a-row class="table-area">
      <a-table
        :columns="columns"
        :data-source="homeworkList"
        bordered
        :pagination="{
          total: homeworkList.length,
          pageSize: 5,
          'hide-on-single-page': true,
          'show-quick-jumper': true,
        }"
        :row-selection="{
          selectedRowKeys: selectedHomeworks,
          onChange: onSelectChange,
          type: 'radio',
        }"
        rowKey="_id"
      >
        <template #operation="record">
          <a-button type="link" @click="deleteHomework(record)">删除</a-button>
        </template>
      </a-table>
    </a-row>
  </a-row>
</template>

<script>
import { mapState } from "vuex";
import axiosInstance from "@/utils/axios";
export default {
  data() {
    const columns = [
      // {
      //   title: "序号",
      //   dataIndex: "index",
      //   align: "center",
      //   width: 80,
      // },
      {
        title: "题目",
        align: "left",
        dataIndex: "title",
        //ellipsis: true, 
        width: "18%",
      },
      {
        title: "内容",
        dataIndex: "content",
        //scopedSlots: { customRender: "grade" },
        align: "left",
        width: "35%",
      },
      {
        title: "附件",
        dataIndex: "attachment",
        //scopedSlots: { customRender: "question_type" },
        align: "center",
        width: "10%",
      },
      {
        title: "截止日期",
        dataIndex: "deadline",
        //scopedSlots: { customRender: "key_word" },
        align: "center",
        width: "15%",
      },
      {
        title: "类型",
        dataIndex: "task_type",
        //scopedSlots: { customRender: "knowledge" },
        align: "center",
      },
      {
        title: "第几次课",
        dataIndex: "number_of_time",
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
      addVisible: false,
      selectedHomeworks: [],
     // add_refresh:0,
      del_refresh:0
    };
  },
  computed: {
    add_refresh() {
      
      if (this.$route.query.add_Refresh)
        return this.$route.query.add_Refresh;
      else return 0;
   
    },
    questionBank() {
      return this.$store.state.teacher.questionBank;
    },
    homeworkList() {
      let temp = this.$store.state.teacher.updateSetHomeworks;
      temp = temp.map((item) => {
        let task_type = "课后作业";
        if (item.task_type === "preview") task_type = "课前预习";
        return {
          ...item,
          task_type: task_type,
        };
      });
      return temp;
    },
  },
  watch: {
    del_refresh(val) {
      this.loadHomeworks();
    },
    add_refresh(val) {
      this.loadHomeworks();
    },
  },
  methods: {
    // 表格选择
    onSelectChange(selectedKeys) {
      // 表格信息的选中
      this.selectedHomeworks = selectedKeys;
      //console.log(this.selectedSchoolyears)
    },
    async loadHomeworks() {
      const lesson_id = this.$route.query.lessonId;
      this.$store.dispatch("teacher/getSetHomeworksByLessonID", { lesson_id });
    },
    async deleteHomework(record) {

      await this.showDeleteConfirm(record._id);

      // record=null
      // this.$emit("showSelected", record);
    },
    showDeleteConfirm(id) {
      // console.log(deleteList);
      var that = this;
      this.$confirm({
        title: "确认删除吗",
        content: "数据删除后不可恢复",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        async onOk() {
          // console.log(deleteList);
          //post deleteList
          const url = "/pc/v1/sethomeworks/" + id;
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
    this.loadHomeworks();
  },
};
</script>

<style scoped>
.table-area {
  margin-top: 20px;
}
</style>
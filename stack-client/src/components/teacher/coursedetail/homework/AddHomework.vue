<template>
  <a-modal
    class="backbody"
    :visible="visible"
    title="添加作业"
    @ok="handleOk"
    width="35%"
    @cancel="$emit('update:visible', false)"
  >
    <a-form-model
      :model="homeworkForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="标题">
        <a-input v-model="homeworkForm.title"></a-input>
      </a-form-model-item>
      <a-form-model-item label="内容">
        <a-textarea v-model="homeworkForm.content"> </a-textarea>
      </a-form-model-item>

      <a-table
        :columns="columns"
        :data-source="sourceList"
        bordered
        :pagination="{
          total: sourceList.length,
          pageSize: 2,
          'hide-on-single-page': true,
          'show-quick-jumper': true,
        }"
        :row-selection="{
          selectedRowKeys: selectedResource,
          onChange: onSelectChange,
          type: 'radio',
        }"
        rowKey="sourceId"
      >
        <!-- <template #tags="tags">
          <a-tag v-for="(item, index) in tags" :key="index" color="#2db7f5">
            {{ item }}
          </a-tag>
        </template>
        <template #operation="record">
          <a-button type="link" @click="download(record)">查看</a-button>
        </template> -->
      </a-table>

      <a-form-model-item label="课前/课后">
        <a-radio-group v-model="homeworkForm.type">
          <a-radio :value="1">课前</a-radio>
          <a-radio :value="2">课后</a-radio>
        </a-radio-group>
      </a-form-model-item>

      <!-- <div class="datepicker"> -->
      <a-date-picker
        class="datepicker"
        show-time
        placeholder="选择提交截止日期"
        @change="onChange"
        @ok="onOk"
      />
      <!-- </div> -->
    </a-form-model>
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
  },
  data() {
    const columns = [
      {
        title: "资源名",
        align: "center",
        dataIndex: "sourceName",
      },
      {
        title: "类型",
        dataIndex: "rsType",
        align: "center",
      },
      // {
      //   title: "关键字",
      //   dataIndex: "tags",
      //   scopedSlots: { customRender: "tags" },
      //   align: "center",

      // },
      // {
      //   title: "操作",
      //   align: "center",
      //   scopedSlots: { customRender: "operation" },
      // },
    ];
    return {
      refresh: 0,
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
      homeworkForm: {
        title: "",
        type: 2,
        content: "",
      },
      // pagination: {
      //   onChange: (page) => {
      //     console.log(page);
      //   },
      //   pageSize: 5,
      //   showQuickJumper: true,
      // },
      //sources,
      optionLength: 2,
      columns,
      inputVisible: false,
      inputValue: "",
      localVisible: false,
      curPage: 1,
      pageSize: 6,
      selectedResource: [],
      deadLine: "2100-12-31 00:00", //默认值，以防教师布置作业时，没有设定时间
    };
  },
  computed: {
    selectedsource() {
      return this.sources.filter((item) => item.selected);
    },
    ...mapGetters({
      resourceList: "teacher/resourceList",
    }),
    ...mapState({
      uid: (state) => state.public.uid,
      sources: (state) => state.teacher.sources,
      curCourseHour: (state) => state.teacher.curCourseHour,
      //selected_IdList:(state) => state.teacher.document,
    }),
    lesson_id() {
      return this.$route.query.lessonId;
    },
    sourceList() {
      if (!this.resourceList) return [];
      let pageEnd = this.curPage * this.pageSize;
      let pageStart = pageEnd - this.pageSize;

      let temp = this.resourceList.map((item) => {
        let src = this.getResourceIconUrl(item.rsType);
        return {
          ...item,
          sourceName: `${item.sourceName}.${item.rsType}`,
          src: require("@/assets/img/SVGS/" + src + ".svg"),
        };
      });
      if (!this.inputValue) return temp.slice(pageStart, pageEnd);
      return temp
        .filter(
          (item) =>
            item.sourceName.includes(this.inputValue) ||
            item.tags.some((tag) => tag.includes(this.inputValue))
        )
        .slice(pageStart, pageEnd);
    },
  },
  methods: {
    onChange(value, dateString) {
      console.log("Selected Time: ", value);
      console.log("Formatted Selected Time: ", dateString);
      this.deadLine = dateString;
    },
    onOk(value) {
      console.log("onOk: ", value);
    },
    onSelectChange(selectedKeys) {
      // 表格信息的选中
      this.selectedResource = selectedKeys;
    },
    handleOk() {
      // TODO 表单验证
      this.submitAddHomework();
      // console.log("--------------"+this.homeworkForm.type)
      // console.log("+++++++++ "+this.curCourseHour)
    },

    submitAddHomework() {
      let task_type = "homework";
      if (this.homeworkForm.type === 1) task_type = "preview";
      axios
        .post("pc/v1/sethomeworks", {
          lesson_id: this.$route.query.lessonId,
          title: this.homeworkForm.title,
          content: this.homeworkForm.content,
          resource_id: this.selectedResource[0],
          task_type: task_type,
          number_of_time: Number.parseInt(this.curCourseHour),
          deadline: this.deadLine,
        })
        .then(({ data }) => {
          if (data.status === "success") {
            this.$message.success("添加作业成功");
            this.$router.push({
              query: { ...this.$route.query, homeworkRefresh: --this.refresh },
            });
            //this.$emit("update:visible", false);
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("添加作业失败");
        });
    },
    getResourceIconUrl(rsType) {
      let iconMap = new Map([
        [["mp4"], "video"],
        [["zip", "rar", "7z", "tar", "gz"], "zip"],
        [["doc", "docx"], "word"],
        [["txt"], "txt"],
        [["psd"], "psd"],
        [["ppt", "pptx"], "ppt"],
        [["png"], "png"],
        [["pdf"], "pdf"],
        [["mp3", "wma", "aac", "wav"], "mp3"],
        [["jpeg", "jpg"], "jpg"],
        [["html"], "html"],
        [["gif"], "gif"],
        [["xlsx", "xls"], "excel"],
      ]);
      for (let [suffix, iconName] of iconMap.entries()) {
        if (suffix.some((item) => item === rsType)) {
          return iconName;
        }
      }
      return "white";
    },
  },
  filters: {
    optionFormatter(value) {
      return String.fromCharCode(64 + value);
    },
  },
  mounted() {
    this.$store.dispatch("teacher/getSources", {
      lesson_id: this.lesson_id,
      teacher_id: this.uid,
    });
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
.datepicker {
  z-index: 111;
}
.backbody {
  position: relative;
  z-index: 1;
}
</style>
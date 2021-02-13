<template>
  <a-modal
    title="批量添加试题"
    :visible="visible"
    width="35%"
    @cancel="$emit('update:visible', false)"
  >
    <a-row>
      <a-col :span="6">
        <a-steps :current="curStep" size="small" direction="vertical">
          <a-step title="导入文件" />
          <a-step title="格式检查" />
          <a-step title="批量上传" />
        </a-steps>
      </a-col>
      <a-col :span="18">
        <a-row class="startEndForm" v-if="curStep === 0">
          <a-upload
            :multiple="true"
            :before-upload="fileInput"
            :file-list="fileList"
            :show-upload-list="false"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          >
            <a-button type="primary"> 选择文件 </a-button>
            <span>{{ fileName }}</span>
          </a-upload>
          <br />
          <br />
          <a-form-model layout="inline" :model="startEndForm">
            <a-form-model-item label="开始行">
              <a-input
                placeholder="请输入数据开始行"
                v-model.number="startEndForm.start"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item label="结束行">
              <a-input
                placeholder="请输入数据结束行"
                v-model.number="startEndForm.end"
              ></a-input>
            </a-form-model-item>
          </a-form-model>
        </a-row>

        <div v-else-if="curStep === 1"></div>

        <div v-else></div>
      </a-col>
    </a-row>

    <template #footer>
      <a-button @click="$emit('update:visible', false)">取消</a-button>
      <a-button type="primary" @click="nextStep">
        {{ curStep === 2 ? "确定" : "下一步" }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import xlsxParser from "@/utils/excelToJson";
import axios from "@/utils/axios";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fileList: [],
      curStep: 0,
      startEndForm: { start: 0, end: 0 },
      labelCol: { span: 5 },
      wrapperCol: { span: 5 },
    };
  },
  computed: {
    fileName() {
      return this.fileList.length ? this.fileList[0].name : "请选择文件";
    },
  },
  methods: {
    fileInput(file) {
      console.log(file);
      this.fileList = [file];
      return false;
    },
    submitRequest() {
      //   xlsxParser();
    },
    cancelRequest() {},
    nextStep() {
      switch (this.curStep) {
        case 0:
          this.curStep++;
          break;
        case 1:
          this.parseExcelData();
          this.curStep++;
          break;
        case 2:
          this.submitRequest();
          this.$emit("update:visible", false);
          break;
        default:
          break;
      }
    },
    checkFormat() {},
    parseExcelData() {
      xlsxParser(this.fileList[0], {
        dataCb: async (data) => {
          console.log("extracted data: ", data);
          try {
            let ques = data.map((item)=>{
             
              return{
                  teacher_id: this.$store.state.public.uid,
                  stem_type: item.stem_type,
                  question_type:item.question_type,
                  lesson_id: this.$route.query.lessonId,
                  knowlege: item.knowlege,
                  key_word: item.key_word,
                  grade: item.grade,
                  analysis: item.analysis,
                  statement: {
                    stem: item.stem,
                    options: item.options.split(" "),
                    right_answer: item.right_answer,
                  },
              }
            })
            const result = await axios.post("/pc/v1/questions/multipleQuestions", ques);
            console.log(result);
            this.$message.success("批量导入成功");
          } catch (error) {
            console.log(error);
            this.$message.error("批量导入失败");
          }
        },
      });
    },
  },
};
</script>

<style scoped>
.startEndForm {
  padding: 0 20px;
}
</style>

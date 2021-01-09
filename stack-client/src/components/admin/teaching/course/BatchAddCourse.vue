<template>
  <a-modal
    title="批量添加教师"
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
      // console.log(file);
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
          break;
        default:
          break;
      }
    },
    checkFormat() {},
    parseExcelData() {
      xlsxParser(this.fileList[0], {
        dataCb: (data) => {
          // console.log("extracted data: ", data);
          axios.post("/pc/v1/courses/batchOptCourses", data);
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

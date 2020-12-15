<template>
  <a-modal
    @cancel="$emit('update:visible', false)"
    @ok="uploadFile"
    :maskClosable="false"
    :confirm-loading="confirmLoading"
    centered
    width="40%"
    :closable="false"
    :destroyOnClose="true"
    :visible="visible"
  >
    <a-form-model
      :model="fileForm"
      ref="fileForm"
      labelAlign="left"
      :rules="formRules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="资源名称" prop="name">
        <a-input placeholder="请输入资源名称" v-model="fileForm.name"></a-input>
      </a-form-model-item>
      <a-form-model-item label="资源标签" prop="tags">
        <a-input
          placeholder="请输入标签名，用 - 隔开"
          v-model="fileForm.tags"
        ></a-input>
      </a-form-model-item>
    </a-form-model>
    <a-upload-dragger
      :multiple="true"
      :before-upload="fileInput"
      :file-list="fileList"
    >
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
      <p class="ant-upload-text">点击或拖拽以上传资源文件</p>
      <p class="ant-upload-hint">
        支持 docx、xlsx、ppt 等文档类型，音视频资源。
      </p>
    </a-upload-dragger>
  </a-modal>
</template>

<script>
import fileUploader from "@/utils/S3FileUploader";
import { mapState } from "vuex";

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
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
      fileForm: { name: "", tags: "" },
      confirmLoading: false,
      formRules: {
        name: [{ required: true, message: "资源名称不能为空" }],
      },
    };
  },
  methods: {
    fileInput(file) {
      console.log(file);
      this.fileList = [file];
      return false;
    },
    uploadFile() {
      this.confirmLoading = true;
      const that = this;
      const config = {
        that,
        apiUrl: "/pc/v1/resources/upload",
        filePath: `${this.oid}/teacher/`,
        body: that.createResource(),
        successCallback() {
          that.$message.success("上传成功！");
          that.confirmLoading = false;
          that.$emit("update:visible", false);
        },
        failCallback(err) {
          console.error(err);
          that.confirmLoading = false;
          that.$message.error("上传失败！");
        },
        progressCallback(...args) {
          console.log({ args });
        },
      };
      const params = { Metadata: { star: "10" } };
      fileUploader(this.fileList, config, params);
    },
    createResource() {
      return {
        ...this.fileForm,
        authorId: this.uid,
        url: this.resourceUrl,
        tags: this.fileForm.tags.split("-"),
      };
    },
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
      oid: (state) => state.public.oid,
    }),
  },
};
</script>

<style scoped>
</style>
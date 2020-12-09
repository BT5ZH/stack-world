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
      confirmLoading: false,
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
        filePath: "/shaanxi-normal-university/",
        body: { name: "第一次上课PPT", tags: ["计算机基础", "计算机历史", "软件开发"] },
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
      const params = {
        Metadata: { uploader: "Henrenx", star: "10" },
      };
      fileUploader(this.fileList, config, params);
    },
  },
};
</script>

<style scoped>
</style>
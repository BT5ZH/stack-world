<template>
  <a-card title="文件下发" class="setcard">
    <a-row type="flex" align="middle" juestify="center" style="padding: 5px">
      <a-space size="large">
        <a-col>
          <a-button @click="sourcevisible = true"
            ><a-icon type="plus" />从资源库选择</a-button
          >
        </a-col>
        <a-modal
          title="选择资源"
          v-model="sourcevisible"
          @ok="selectsource"
          :zIndex="10001"
        >
          card?
        </a-modal>
        <a-col>
          <a-upload :before-upload="fileInput" :file-list="fileList">
            <a-button> <a-icon type="upload" /> 上传新资料 </a-button>
          </a-upload>
        </a-col>
        <a-col>
          <p>可上传视频,word,pdf,excel,图片等</p>
        </a-col>
      </a-space>
    </a-row>
    <br />
    <a-row>
      <a-card style="padding: 3px">
        <a-empty />
      </a-card>
    </a-row>
  </a-card>
</template>

<script>
import fileUploader from "@/utils/S3FileUploader";
export default {
  data() {
    return {
      fileList: [],
      headers: {
        authorization: "authorization-text",
      },
      sourceVisible: false,
    };
  },
  methods: {
    selectsource() {},
    uploadFile() {
      this.confirmLoading = true;
      const url = "/s3";
      const that = this;
      const config = {
        that,
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
      fileUploader(this.fileList, url, "", config, params);
    },
    handleChange({ file, fileList }) {
      if (file.status !== "uploading") {
        console.log(file, fileList);
      }
    },
  },
};
</script>
<style>
.ant-card-body {
  padding: 20px;
}
</style>
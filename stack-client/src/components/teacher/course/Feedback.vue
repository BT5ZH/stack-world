<template>
  <div>
    <a-upload :before-upload="fileInput" :file-list="fileList">
      <a-button type="primary">选择文件</a-button>
    </a-upload>
    <br />
    <a-button type="primary" @click="uploadFile">开始上传</a-button>
    <a-row type="flex" justify="center">
      <a-pagination
        class="pagination"
        :total="50"
        :show-size-changer="true"
        :show-quick-jumper="true"
      ></a-pagination>
    </a-row>
  </div>
</template>

<script>
import fileUploader from "@/utils/S3FileUploader";

export default {
  data() {
    return {
      fileList: [],
    };
  },
  methods: {
    fileInput(file) {
      console.log(file);
      this.fileList = [file];
      return false;
    },
    uploadFile() {
      const url = "/s3";
      const config = {
        that: this,
        successCallback() {
          this.$message.success("上传成功！");
        },
        failCallback(err) {
          console.error(err);
          this.$message.error("上传失败！");
        },
      };
      const params = {
        Metadata: { uploader: "Henrenx", star: "10" },
      };
      // fileList 是包含着文件的数组
      fileUploader(this.fileList, url, "", config, params);
    },
  },
};
</script>

<style scoped>
.pagination {
  position: absolute;
  bottom: 10px;
}
</style>
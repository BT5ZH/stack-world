<template>
  <a-row>
    <a-row type="flex" justify="center" align="middle" class="profile">
      <a-col :span="1">
        <a-icon type="tags" style="font-size: 40px; color: #5c6bc0" />
      </a-col>
      <a-col :span="15">
        <h2>{{ teacherName }}</h2>
        <span class="account">账号：{{ uid }}</span>
        <span>工号：{{ workNumber }}</span>
      </a-col>
      <a-col :span="7">
        <a-button icon="calendar" size="large">我的课表</a-button>
      </a-col>
    </a-row>
    <a-row class="content">
      <a-upload :before-upload="fileInput" :file-list="fileList">
        <a-button type="primary">选择文件</a-button>
      </a-upload>
      <a-button type="primary" @click="uploadFile">开始上传</a-button>
    </a-row>
  </a-row>
</template>

<script>
import fileUploader from "@/utils/fileUploader";

export default {
  components: {},
  data() {
    return {
      teacherName: "李师",
      uid: "201501245789",
      workNumber: "201501245789",
      fileList: []
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
        }
      };
      const params = {
        Metadata: { uploader: "Henrenx", star: "10" }
      };
      fileUploader(this.fileList, url, "", config, params);
    }
  }
};
</script>

<style scoped>
.profile,
.content {
  background: #f8f8f8;
  padding: 20px 0;
}

.account {
  margin-right: 30px;
}

.content {
  margin-top: 10px;
}
</style>
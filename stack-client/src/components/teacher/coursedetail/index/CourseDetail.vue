<template>
  <a-row class="container">
    <a-row type="flex" justify="center" align="middle" class="profile">
      <a-col :span="1">
        <a-icon type="tags" style="font-size: 40px; color: #5c6bc0" />
      </a-col>
      <a-col :span="18">
        <h2>{{ teacherName }}</h2>
        <span class="account">账号：{{ uid }}</span>
        <span>工号：{{ workNumber }}</span>
      </a-col>
      <a-col :span="3">
        <a-button icon="calendar" size="large">我的课表</a-button>
      </a-col>
    </a-row>
    <a-row class="content">
      <a-row>
        <a-col :span="3">
          <a-menu style="width: 150px" @click="handleClick" v-model="curMenus">
            <a-menu-item key="Resource">课程资源</a-menu-item>
          </a-menu>
        </a-col>
        <a-col :span="21">
          <component :is="curMenus[0]"></component>
        </a-col>
      </a-row>
    </a-row>
  </a-row>
</template>

<script>
// import fileUploader from "@/utils/expressFileUploader";
import Resource from "../resource/Resource";

export default {
  components: { Resource },
  data() {
    return {
      teacherName: "李师",
      uid: "201501245789",
      workNumber: "201501245789",
      fileList: [],
      curMenus: ["Resource"],
    };
  },
  methods: {
    fileInput(file) {
      console.log(file);
      this.fileList = [file];
      return false;
    },
    uploadFile() {
      // const url = "/s3";
      // const config = {
      //   that: this,
      //   successCallback() {
      //     this.$message.success("上传成功！");
      //   },
      //   failCallback(err) {
      //     console.error(err);
      //     this.$message.error("上传失败！");
      //   },
      // };
      // const params = {
      //   Metadata: { uploader: "Henrenx", star: "10" },
      // };
      // fileUploader(this.fileList, url, "", config, params);
    },
    handleClick() {},
  },
  created() {},
};
</script>

<style scoped>
.container {
  background: #f0f2f5;
  padding: 15px 20px 0;
}

.profile {
  padding: 20px;
}

.profile,
.content {
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
}

.account {
  margin-right: 30px;
}

.content {
  margin-top: 15px;
  padding: 10px 20px 0;
}
</style>
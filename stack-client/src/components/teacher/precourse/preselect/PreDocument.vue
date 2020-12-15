<template>
  <a-card title="文件下发" class="setcard">
    <a-row type="flex" align="middle" juestify="center" style="padding: 5px">
      <a-space size="large">
        <a-col>
          <a-button><a-icon type="plus" />从资源库选择</a-button>
        </a-col>
        <a-col>
          <a-upload
            name="file"
            :multiple="true"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :headers="headers"
            @change="handleChange"
          >
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
    <a-row
      type="flex"
      justify="end"
      align="bottom"
      style="position: absolute; bottom: 20px; right: 20px"
    >
      <a-col>
        <a-button type="primary"> 保存 </a-button>
        &nbsp;&nbsp;&nbsp;
        <a-button type="primary"> 取消 </a-button>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
export default {
  data() {
    return {
      headers: {
        authorization: "authorization-text",
      },
    };
  },
  methods: {
    handleChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
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
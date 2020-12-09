<template>
  <a-row>
    <a-row>
      <a-col :span="5">
        <a-input-search
          placeholder="名称、知识点"
          enter-button
          @search="onSearch"
        />
      </a-col>
      <a-col :span="12"></a-col>
      <a-col :span="6">
        <a-button type="primary" @click="localVisible = true"
          >本地上传</a-button
        >
        &nbsp;&nbsp;
        <a-button type="primary" @click="libiaryVisible = true"
          >资源库导入</a-button
        >
        &nbsp;&nbsp;
        <a-button type="primary">删除</a-button>
      </a-col>
    </a-row>

    <libiary :visible.sync="libiaryVisible"></libiary>
    <local :visible.sync="localVisible"></local>
  </a-row>
</template>

<script>
import Libiary from "./Libiary";
import Local from "./Local";

export default {
  components: { Libiary, Local },
  data() {
    return {
      libiaryVisible: false,
      localVisible: false,
    };
  },
  methods: {
    onSearch() {},
  },
};
</script>

<style scoped>
</style>

<style>
.ant-upload {
  padding: 90px;
}
</style>
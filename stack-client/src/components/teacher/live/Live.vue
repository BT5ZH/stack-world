<template>
  <div>
    <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="姓名">
        <a-input v-model="name"></a-input>
      </a-form-model-item>
      <a-form-model-item label="角色">
        <a-input v-model="role"></a-input>
      </a-form-model-item>
      <a-form-model-item label="消息">
        <a-input v-model="role"></a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-button @click="sendMessage" type="primary">发送消息</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      role: "",
      message: "",
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
  },
  methods: {
    sendMessage() {},
  },
};
</script>

<style>
</style>
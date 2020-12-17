<template>
  <div class="userContainer">
    <a-card class="userCard" hoverable>
      <template slot="actions" class="ant-card-actions">
        <a-icon v-if="!isEdit" key="edit" type="edit" @click="editForm" />
        <a-icon v-else key="save" type="save" @click="submitForm" />
      </template>
      <a-card-meta :title="userName" :description="userClass">
        <a-avatar
          slot="avatar"
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />
      </a-card-meta>
      <br />
      <a-input
        ref="userNameInput"
        v-model="phone"
        placeholder="phone number"
        disabled
      >
        <a-icon slot="prefix" type="phone" />
      </a-input>
      <br />
      <br />
      <a-input
        ref="userNameInput"
        v-model="email"
        placeholder="email adress"
        :disabled="!isEdit"
      >
        <a-icon slot="prefix" type="mail" />
      </a-input>
      <br />
      <br />
      <a-input
        ref="userNameInput"
        v-model="school"
        placeholder="school"
        disabled
      >
        <a-icon slot="prefix" type="bank" />
      </a-input>
      <br />
      <br />
    </a-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEdit: false,
      userName: "Jose Phillips",
      userClass: "class 1",
      phone: "1234567890",
      email: "112233@qq.com",
      school: "hello academy",
    };
  },
  methods: {
    emitEmpty() {
      this.$refs.userNameInput.focus();
      this.userName = "";
    },
    submitForm() {
      this.isEdit = !this.isEdit;
    },
    editForm() {
      this.isEdit = !this.isEdit;
    },
  },
};
</script>

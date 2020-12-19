<template>
  <div class="userContainer">
    <a-card class="userCard" hoverable>
      <template slot="actions" class="ant-card-actions">
        <a-icon v-if="!isEdit" key="edit" type="edit" @click="editForm" />
        <a-icon v-else key="save" type="save" @click="submitForm" />
      </template>
      <a-card-meta :title="user.name" :description="user.class">
        <a-avatar
          slot="avatar"
          size="large"
          :style="{ backgroundColor: '#ffbf00', verticalAlign: 'middle' }"
        >
          {{ avatarValue }}
        </a-avatar>
        <!-- <a-avatar v-else slot="avatar" icon="edit"/> -->
      </a-card-meta>
      <br />
      <a-input
        ref="userNameInput"
        v-model="user.phone"
        placeholder="phone number"
        disabled
      >
        <a-icon slot="prefix" type="phone" />
      </a-input>
      <br />
      <br />
      <a-input
        ref="userNameInput"
        v-model="user.email"
        placeholder="email adress"
        :disabled="!isEdit"
      >
        <a-icon slot="prefix" type="mail" />
      </a-input>
      <br />
      <br />
      <a-input
        ref="userNameInput"
        v-model="user.org_name"
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
import { mapState } from "vuex";

export default {
  data() {
    return {
      avatarValue: "Hello",
      isEdit: false,
      img: "",
      datas: new FormData(),
      files: 0,
      size: 0,
    };
  },
  methods: {
    submitForm() {
      this.user.email==''
        ? this.$message.info("邮箱不可为空")
        : (this.postForm({email:this.user.email})
          ,this.isEdit = !this.isEdit);
    },
    postForm(data){
      this.$store.dispatch("student/changeUserInfo", data).then((res)=>{
        console.log(res)
        res=='success'?
        this.$message.success("修改成功"):
        this.$message.error("修改失败");
      });
    },
    editForm() {
      this.isEdit = !this.isEdit;
    },
  },
  mounted() {
    let name = new String(this.user.name);
    this.avatarValue = name.substring(0, 1);
  },
  computed: {
    ...mapState({
      user: (state) => state.student.user,
    }),
  },
};
</script>

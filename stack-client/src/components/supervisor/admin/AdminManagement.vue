<template>
  <a-row>
    <a-row type="flex" justify="space-between" class="admin-header">
      <a-col :span="4">
        <a-select v-model="school" @change="changeInfo" style="width: 100%">
          <a-select-option
            v-for="(item, index) in schoolList"
            :key="index"
            :value="item.schoolName"
            >{{ item.schoolName }}</a-select-option
          >
        </a-select>
      </a-col>
      <a-col :span="2">
        <a-button type="primary" @click="addAdmin">添加管理</a-button>
      </a-col>
    </a-row>

    <a-row class="admin-body">
      <a-col :span="4" v-for="(item, index) in userInfoList" :key="index">
        <a-card hoverable align="center">
          <a-avatar :size="64" icon="user" src id="icon" />
          <a-card-meta :description="item.name" class="card_info"></a-card-meta>
          <a-card-meta :description="item.email"></a-card-meta>
          <template slot="actions" class="ant-card-actions">
            <a-button type="link" block @click="newPassword(item._id)"
              >重置密码</a-button
            >
            <a-button type="link" block @click="changeActive(item._id)">{{
              item.active ? "冻结管理" : "激活管理"
            }}</a-button>
          </template>
        </a-card>
      </a-col>
    </a-row>

    <a-modal
      title="添加管理"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model
        :model="addUserInfo"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        labelAlign="left"
      >
        <a-form-model-item label="昵称" prop="name">
          <a-input
            placeholder="请输入昵称"
            v-model="addUserInfo.name"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email">
          <a-input
            placeholder="请输入邮箱"
            v-model="addUserInfo.email"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-row>
</template>

<script>
import axios from "@/utils/axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      school: "请选择学校",
      orgName: "",
      visible: false,
      confirmLoading: false,
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
      rules: {
        name: [{ required: true, message: "昵称不能为空" }],
        email: [{ required: true, message: "邮箱不能为空" }],
      },
      addUserInfo: { name: "", email: "" },
      userInfoList: [
        {
          _id: "123",
          name: "青空",
          email: "2756878164@qq.com",
          active: false,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      schoolList: (state) => {
        const list = state.super.schoolList;
        return list.map((item) => item.schoolName);
      },
    }),
  },
  methods: {
    newPassword(value) {
      console.log(value);
    },
    changeActive(value) {
      console.log(value);
    },
    changeInfo(value) {
      console.log(value);
    },
    getSchool() {},
    addAdmin() {
      // console.log("addAdmin");
      this.visible = true;
    },
    disabledAdmin() {
      console.log("disabledAdmin");
      document.getElementById("icon").style.background = "#CCCCCC";
    },
    handleOk() {
      let that = this;
      let name = this.addUserInfo.name;
      let email = this.addUserInfo.email;
      let org_name = this.orgName;

      let admin = {
        name: name,
        email: email,
        password: "12345678",
        passwordConfirm: "12345678",
        org_name: org_name,
        role: "orgAdmin",
      };

      axios.post("/pc/v1/users/signup", admin).then(
        function (res) {
          console.log(res);
          if (res.status === "scccess") {
            that.$message.success("添加成功");
          }
        },
        function (err) {
          console.log(err);
          that.$message.error("添加失败");
        }
      );

      // this.userInfoList.push(user);
      // console.log(this.userInfoList);
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
        this.addUserInfo.name = "";
        this.addUserInfo.email = "";
      }, 2000);
    },
    handleCancel() {
      console.log("Clicked cancel button");
      this.visible = false;
    },
  },
  mounted() {
    if (!this.schoolList.length) {
      this.$store.dispatch("super/getSchoolList");
    }
  },
};
</script>

<style scoped>
.admin-header {
  background: #fff;
  padding: 15px 10px;
  border-radius: 5px;
}

.admin-body {
  padding: 15px 0;
}

.card_info {
  margin: 10px;
}

#icon {
  background-color: #1da57a;
}
</style>
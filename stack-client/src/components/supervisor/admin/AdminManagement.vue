<template>
  <a-row>
    <a-row type="flex" justify="space-between" class="admin-header">
      <a-col :span="4">
        <a-select v-model="school" @change="changeSchool" style="width: 100%">
          <a-select-option
            v-for="(item, index) in schoolNameList"
            :key="index"
            :value="index"
            >{{ item.schoolName }}</a-select-option
          >
        </a-select>
      </a-col>
      <a-col :span="2">
        <a-button type="primary" @click="visible = true">添加管理</a-button>
      </a-col>
    </a-row>

    <a-row class="admin-body" :gutter="[20, 20]">
      <a-col :span="6" v-for="(item, index) in adminList" :key="index">
        <a-card hoverable align="center">
          <a-avatar
            :size="64"
            icon="user"
            :style="{ background: item.active ? '#1da57a' : '#CCC' }"
          />
          <a-card-meta :description="item.name" class="card_info" />
          <a-card-meta :description="item.email" class="card_info" />
          <a-card-meta :description="curSchoolName" class="card_info" />
          <template slot="actions" class="ant-card-actions">
            <a-button type="link" block @click="resetPassword(item._id)">
              重置密码
            </a-button>
            <a-button
              type="link"
              block
              @click="changeActive(item._id, item.active)"
            >
              {{ item.active ? "冻结管理" : "激活管理" }}
            </a-button>
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
      school: 0,
      visible: false,
      confirmLoading: false,
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
      rules: {
        name: [{ required: true, message: "昵称不能为空" }],
        email: [{ required: true, message: "邮箱不能为空" }],
      },
      addUserInfo: { name: "", email: "" },
    };
  },
  computed: {
    ...mapState({
      schoolNameList: (state) => {
        const list = state.super.schoolList;
        return list.map(({ schoolName, sid }) => ({ schoolName, sid }));
      },
      adminList: (state) => state.super.adminList,
      uid: (state) => state.public.uid,
    }),
    curSchoolName() {
      return this.schoolNameList[this.school].schoolName;
    },
  },
  methods: {
    resetPassword(id) {
      const that = this;
      this.$confirm({
        title: "要为该管理员重置密码吗？",
        content: (h) => (
          <div style="color:red;">重置密码后，相关账户会收到一封邮件</div>
        ),
        okType: "danger",
        onOk: () => {
          that.submitResetPassword(id);
        },
      });
    },
    submitResetPassword(id) {
      const url = "/pc/v1/users/" + id;
      const requestData = { password: "snnu1234" };
      axios
        .patch(url, requestData)
        .then(({ data }) => {
          if (data.status === "success") {
            this.$message.success("重置密码成功");
            this.changeSchool(this.school);
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("重置密码失败");
        });
    },
    submitResetActive(id, active, activeText) {
      const url = "/pc/v1/users/" + id;
      const requestData = { active: !active };
      axios
        .patch(url, requestData)
        .then(({ data }) => {
          if (data.status === "success") {
            this.$message.success(activeText + "成功");
            this.changeSchool(this.school);
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error(activeText + "失败");
        });
    },
    changeActive(id, active) {
      const that = this;
      const activeText = active ? "冻结" : "解冻";
      this.$confirm({
        title: `确定要${activeText}该管理员吗？`,
        okType: "info",
        onOk: () => {
          that.submitResetActive(id, active, activeText);
        },
      });
    },
    changeSchool(value) {
      const schoolName = this.schoolNameList[value].schoolName;
      this.$store.dispatch("super/getAdminList", schoolName);
    },
    handleOk() {
      this.confirmLoading = true;
      const { email, name } = this.addUserInfo;
      const requestData = {
        name,
        email,
        password: "snnu1234",
        passwordConfirm: "snnu1234",
        org_name: this.curSchoolName,
        role: "orgAdmin",
      };
      axios
        .post("/pc/v1/users/admin", requestData)
        .then(({ data }) => {
          if (data.status === "success") {
            this.$message.success("添加管理员成功");
            this.changeSchool(0);
            setTimeout(() => {
              this.visible = false;
              this.confirmLoading = false;
              this.addUserInfo.name = "";
              this.addUserInfo.email = "";
            }, 2000);
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("创建管理员失败");
        });
    },
    handleCancel() {
      this.visible = false;
    },
  },
  mounted() {
    this.$store.dispatch("super/getSchoolList").then(() => {
      this.changeSchool(0);
    });
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
  margin: 5px 0;
}
</style>
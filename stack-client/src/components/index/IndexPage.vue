<template>
  <div class="login">
    <div class="container-login100">
      <div class="wrap-login100">
        <div class="title">教学小栈</div>
        <div class="login100-pic js-tilt" data-tilt>
          <img src="../../../static/images/img-01.png" alt="IMG" />
        </div>
        <form class="login100-form validate-form">
          <span class="login100-form-title">用户登录</span>

          <div class="wrap-input100" v-show="errorTipShow">
            <a-alert type="error" message="账号或密码错误" show-icon />
          </div>

          <div class="wrap-input100 validate-input">
            <input
              class="input100"
              autocomplete="username"
              type="text"
              name="email"
              v-model="account"
              placeholder="手机号/邮箱"
            />
            <span class="input-icon">
              <a-icon type="user" />
            </span>
          </div>
          <div class="wrap-input100 validate-input">
            <input
              class="input100"
              autocomplete="current-password"
              type="password"
              name="pass"
              v-model="password"
              placeholder="密码"
            />
            <span class="input-icon">
              <a-icon type="lock" />
            </span>
          </div>
          <div class="container-login100-form-btn">
            <button class="login100-form-btn" @click.prevent="login">
              登&nbsp;&nbsp;录
            </button>
          </div>
          <div class="text-center p-t-12"></div>
          <div class="text-center p-t-80"></div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/axios";

export default {
  name: "IndexLogin",
  data() {
    return {
      account: "",
      password: "",
      errorTipShow: false,
      userMap: {
        superAdmin: { name: "super", index: "/supervisor/school" },
        student: { name: "user", index: "/student/home" },
        orgAdmin: { name: "admin", index: "/admin/semester" },
        teacher: { name: "teacher", index: "/teacher/index" },
        patrol: { name: "patrol", index: "/patrol" },
      },
    };
  },
  methods: {
    login() {
      const requestData = {
        email: this.account,
        password: this.password,
      };
      axios
        .post("pc/v1/users/login", requestData)
        .then(({ data }) => {
          const { status, token } = data;
          // TODO replce the word 'success' with 'success' whenever backend fixs the bug
          if (status !== "success") {
            this.errorTipShow = true;
            return;
          }
          localStorage.setItem("tk", token);
          axios.defaults.headers["Authorization"] = "Bearer " + token;
          console.log(axios.defaults);
          const navigateUrl = this.updatePublicVuexData(data.data);
          setTimeout(() => {
            this.$router.push(navigateUrl);
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    updatePublicVuexData(context) {
      const publicVuexData = {
        role: this.userMap[context.role]["name"],
        oid: context.org_id,
        uid: context._id,
        photo: context.photo,
        ...context,
      };
      this.$store.commit("public/updateIdList", publicVuexData);
      return this.userMap[context.role]["index"];
    },
    checkInputFormatter() {
      if (!this.message_can) return false;
      if (!this.account) {
        this.$message({ type: "error", message: "请输入账号" });
        this.message_can = false;
        setTimeout(() => (this.message_can = true), 2000);
        return false;
      }
      if (!this.password) {
        this.$message({ type: "error", message: "请输入密码" });
        this.message_can = false;
        setTimeout(() => (this.message_can = true), 2000);
        return false;
      }
      const exp_email = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      const exp_phone = /^1(3|4|5|6|7|8|9)\d{9}$/;
      let isEmail = exp_email.test(this.account);
      let isPhone = exp_phone.test(this.account);
      if (!isEmail && !isPhone) {
        this.$message({ type: "error", message: "请输入邮箱或手机号" });
        this.message_can = false;
        setTimeout(() => (this.message_can = true), 2000);
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped>
@import "../../../static/css/main.css";
@import "../../../static/css/util.css";

.input-icon {
  position: relative;
  left: 25px;
  top: -35px;
  font-size: 20px;
}

.title {
  width: 100%;
  text-align: center;
  position: relative;
  top: -100px;
  font-size: 25px;
}
</style>
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
          <div class="text-center p-t-12">
            <a class="txt2" href="#">忘记密码？</a>
          </div>
          <div class="text-center p-t-80">
            <router-link class="txt2" :to="{ name: 'register' }">
              还没有账号？立即注册
              <i class="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IndexLogin",
  data() {
    return {
      account: "",
      password: "",
      message_can: true,
    };
  },
  methods: {
    async login() {
      // let form = { account: this.account, pass: MD5(this.password) };
      // if (this.checkInputFormatter()) {
      //   try {
      //     let { data } = await instance.post("/login", form);
      //     console.log({ 登录: data });
      //     if (data.status) {
      //       let { auth, user } = data.message;
      //       this.$store.commit("changeUserInfo", user);
      //       localStorage.setItem("auth", auth);
      //       this.$store.commit("initHeaders");
      //       await this.$store.dispatch("getAccountList");
      //       await this.$store.dispatch("getUserSettings");
      //       this.$router.push("/news");
      //       this.$message({
      //         message: `欢迎回来  ${user.name}`,
      //         type: "success"
      //       });
      //     } else {
      //       this.$message({ message: "账号或密码错误!", type: "error" });
      //       this.password = "";
      //     }
      //   } catch (error) {
      //     console.error({ 登录失败: error });
      //     this.$message({ type: "error", message: "登录失败" });
      //   }
      this.$router.push({ name: "admin_institution" });
    },
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
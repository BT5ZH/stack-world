<template>
  <div>
    <!-- 头部 -->
    <a-page-header :title="userName">
      <div class="quit">
        <a-button @click="quitLogin" type="link">退出登录</a-button>
      </div>
    </a-page-header>
    <router-view />
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    quitLogin() {
      // this.$store.commit("patrol/clearStorage");
      this.$store.commit("public/clearStorage");
      localStorage.clear();
      sessionStorage.clear();
      this.$router.push({ name: "index" });
    },
  },
  computed: {
    ...mapState({
      userName: (state) => state.public.userName,
      //   user: (state) => state.student.user,
    }),
  },
};
</script>
<style>
.quit {
  position: absolute;
  right: 200px;
  top: 20px;
}
</style>

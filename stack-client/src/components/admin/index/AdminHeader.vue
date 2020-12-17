<template>
  <div>
    <div style="float: right">
      <a-button @click="quitLogin" type="link">退出登录</a-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    quitLogin() {
      this.$store.replaceState({});
      localStorage.clear();
      sessionStorage.clear();
      this.$router.push({ name: "index" });
    }
  }
}
</script>

<style>
</style>
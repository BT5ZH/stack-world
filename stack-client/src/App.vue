<template>
  <div id="app">
    <a-config-provider :locale="zhCN">
      <router-view></router-view>
    </a-config-provider>
  </div>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";

export default {
  name: "App",
  data: () => ({ zhCN }),
};
</script>

<style>
  #app {
    height: 100%;
  }
</style>

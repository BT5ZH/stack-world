<template>
  <a-layout style="height: 100%">
    <a-layout-header style="background: #fff">
      <supervisor-header />
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200px">
        <supervisor-aside />
      </a-layout-sider>
      <a-layout-content>
        <router-view class="container" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import SupervisorAside from "./SupervisorAside";
import SupervisorHeader from "./SupervisorHeader";

export default {
  components: { SupervisorAside, SupervisorHeader },
};
</script>

<style scoped>
.container {
  padding: 10px 20px 20px;
}
</style>

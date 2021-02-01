<template>
  <a-layout>
    <a-layout-header>
      <teacher-header></teacher-header>
    </a-layout-header>
    <a-layout-content>
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script>
import TeacherHeader from "./TeacherHeader";
export default {
  components: { TeacherHeader },
};
</script>

<style>
.ant-layout {
  background: #fff;
  height: 100%;
}

.ant-layout-header {
  background: #fff;
}

.ant-layout-sider {
  background: #fff;
}
</style>

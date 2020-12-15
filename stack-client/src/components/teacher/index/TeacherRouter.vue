<template>
  <a-layout>
    <a-layout-header>
      <teacher-header></teacher-header>
    </a-layout-header>
    <a-layout-content>
      <a-layout>
        <a-layout-sider> </a-layout-sider>
        <a-layout-content>
          <router-view />
        </a-layout-content>
        <a-layout-sider> </a-layout-sider>
      </a-layout>
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
.ant-layout,
.ant-layout-header,
.ant-layout-sider {
  background: #fff;
}
</style>
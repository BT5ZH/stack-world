<template>
  <a-layout style="height: 100%">
    <a-layout-header style="background: #fff">
      <admin-header />
    </a-layout-header>
    <a-layout>
      <a-layout-sider>
        <admin-aside width="200px" />
      </a-layout-sider>
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import AdminAside from "./AdminAside";
import AdminHeader from "./AdminHeader";

export default {
  components: { AdminAside, AdminHeader },
};
</script>

<template>
  <a-menu mode="inline" theme="dark" @click="route_to" v-model="selectedKeys">
    <a-menu-item key="supervisor_school">
      <a-icon type="deployment-unit" />
      <span>学校管理</span>
    </a-menu-item>
    <a-menu-item key="supervisor_admin">
      <a-icon type="deployment-unit" />
      <span>学校admin管理</span>
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  data() {
    return {
      selectedKeys: ['supervisor_school']
    }
  },
  methods: {
    route_to({ key }) {
      if (this.$route.name !== key) {
        this.$router.push({ name: key });
      }
    },
  },
};
</script>

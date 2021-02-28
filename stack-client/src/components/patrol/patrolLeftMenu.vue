<template>
  <div>
    <a-menu style="height: 100vh" theme="dark" @click="go_to">
      <a-sub-menu key="0">
        <span slot="title"><a-icon type="mail" /><span>课堂巡视</span></span>
      </a-sub-menu>
      <a-sub-menu key="1">
        <span slot="title"><a-icon type="mail" /><span>查询备课</span></span>
      </a-sub-menu>
    </a-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    go_to() {
      console.log("menu");
    },
  },
};
</script>

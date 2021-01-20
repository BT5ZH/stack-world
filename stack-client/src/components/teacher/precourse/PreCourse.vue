<template>
  <a-row type="flex" align="top" class="courseslider">
    <!-- :style="{ height: containerHeight }" -->
    <a-col :span="4" class="sider">
      <pre-collapse></pre-collapse>
    </a-col>
    <a-col :span="20">
      <pre-context></pre-context>
    </a-col>
  </a-row>
</template>

<script>
import PreCollapse from "./PreCollapse";
import PreContext from "./PreContext";
export default {
  components: { PreCollapse, PreContext },
  data() {
    return {};
  },
  computed: {
    // containerHeight() {
    //   return `${window.innerHeight - 64}px`;
    // },
  },
};
</script>

<style scoped>
.courseslider {
  /* height: calc(100% - 64px); */
  height: 100%;
}
.sider {
  overflow-y: auto;
  height: 100%;
  background: #19191a;
}
</style>

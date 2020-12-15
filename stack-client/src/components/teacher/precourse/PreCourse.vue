<template>
  <a-row
    type="flex"
    align="top"
    class="courseslider"
    :style="{ height: containerHeight }"
  >
    <a-col :span="4" class="sider">
      <pre-collapse></pre-collapse>
    </a-col>
    <a-col :span="20" style="background: #f0f2f5; padding: 10px">
      <a-row style="background: #fff">
        <pre-header></pre-header>
      </a-row>
      <pre-context></pre-context>
    </a-col>
  </a-row>
</template>

<script>
import PreCollapse from "./PreCollapse";
import PreContext from "./PreContext";
import PreHeader from "./PreHeader";
export default {
  components: { PreCollapse, PreContext, PreHeader },
  data() {
    return {};
  },
  computed: {
    containerHeight() {
      return `${window.innerHeight - 64}px`;
    },
  },
};
</script>

<style scoped>
.courseslider {
  height: calc(100% - 64px);
}
.sider {
  overflow-y: auto;
  height: 100%;
  background: #000000;
}
</style>
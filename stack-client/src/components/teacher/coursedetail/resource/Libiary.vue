<template>
  <a-modal v-model="visible" :maskClosable="false"> </a-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
</style>
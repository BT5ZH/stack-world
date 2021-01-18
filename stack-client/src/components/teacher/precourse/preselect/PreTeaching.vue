<template>
  <div>
    <a-card title="讲课" class="setcard">
    </a-card>
    <br />
    <a-button type="primary" @click="on_pptvisible"> 选择PPT </a-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    on_pptvisible() {
      this.$emit("selectppt",true);
    },
  },
};
</script>

<style scoped>
</style>
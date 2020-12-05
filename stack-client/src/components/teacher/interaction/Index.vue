<template>
  <div>
    <component :is="tabName"> </component>
  </div>
</template>

<script>
import A from "XXX";
import B from "XXX";
import C from "XXX";
export default {
  components: { A, B, C },
  data() {
    return {
      tabName: "A",
    };
  },
};
</script>

<style>
</style>
<template>
  <component v-if="emptyShow" :is="curActivity"></component>
  <a-empty v-else></a-empty>
</template>

<script>
import sign from "./activities/Sign";
import test from "./activities/Test";
import { mapState } from "vuex";

export default {
  components: { sign, test },
  data() {
    return {
      activityList: ["sign", "test"],
    };
  },
  computed: {
    ...mapState({
      curActivity: (state) => state.teacher.curActivity,
    }),
    emptyShow() {
      return this.activityList.some((item) => item === this.curActivity);
    },
  },
  methods: {},
};
</script>

<style scoped>
</style>
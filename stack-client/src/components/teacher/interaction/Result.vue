<template>
  <component v-if="emptyShow" :is="curActivity"></component>
  <a-empty v-else></a-empty>
</template>

<script>
import sign from "./activities/Sign";
import test from "./activities/Test";
import vote from "./activities/Vote";
import race from "./activities/Race";

import { mapState } from "vuex";

export default {
  components: { sign, test, race, vote },
  data() {
    return {
      activityList: ["sign", "test", "race", "vote"],
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
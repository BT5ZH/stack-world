<template>
  <component v-if="emptyShow" :is="curType"></component>
  <a-empty v-else></a-empty>
</template>

<script>
import { mapState } from "vuex";

import sign from "./activities/Sign";
import test from "./activities/Test";
import vote from "./activities/Vote";
import race from "./activities/Race";
import ask from "./activities/Ques";

export default {
  components: { sign, test, race, vote, ask },
  data() {
    return {
      activityList: ["sign", "test", "race", "vote", "ask"],
    };
  },
  computed: {
    ...mapState({
      curActivity: (state) => state.teacher.curActivity,
    }),
    curType() {
      return this.curActivity ? this.curActivity.curType : "";
    },
    emptyShow() {
      return this.activityList.some((item) => item === this.curType);
    },
  },
  methods: {},
};
</script>

<style scoped>
</style>
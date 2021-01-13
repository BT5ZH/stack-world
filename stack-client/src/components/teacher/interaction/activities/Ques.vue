<template>
  <div>
    <a-list item-layout="horizontal">
      <a-list-item>
        {{ask_answer.student}}:{{ask_answer.value}}
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      ask_answer: (state) => state.teacher.ask_answer,
    }),
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
</style>
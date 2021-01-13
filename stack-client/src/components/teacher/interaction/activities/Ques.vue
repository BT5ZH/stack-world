<template>
  <a-row>
    <a-col :span="18" :push="3">
      <h1 class="sign-title">提问结果</h1>
      <a-list size="small" bordered v-if="ask_answer.value != null">
        <a-list-item>
          <span class="name"> {{ ask_answer.student }} </span>
          <a-tag color="#2db7f5">{{ ask_answer.value }}</a-tag>
        </a-list-item>
      </a-list>

      <a-empty v-else description="暂无提交结果"> </a-empty>
    </a-col>
  </a-row>
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
.sign-title {
  font-weight: bold;
  color: #bbb;
  text-align: center;
  padding: 20px 0;
}
</style>
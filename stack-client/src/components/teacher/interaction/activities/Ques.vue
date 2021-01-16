<template>
  <a-row>
    <a-col :span="18" :push="3">
      <h1 class="sign-title">提问结果</h1>
      <div class="teacher_question">问题:&nbsp;{{ask_answer.question.stem}}</div>
      <div class="teacher_question">正确答案:&nbsp;{{ask_answer.question.right_answer}}</div>
      <a-list
        size="small"
        bordered
        v-if="ask_answer.id"
      >
        <template>
          <a-list-item>
            <span class="name"> {{ ask_answer.student }} </span>
            <a-tag color="#2db7f5">{{ ask_answer.answer }}</a-tag>
          </a-list-item>
        </template>
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
  mounted() {
    // console.log("question----")
    // console.log(this.ask_answer.question)
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
.teacher_question {
  font-weight: bold;
}
</style>
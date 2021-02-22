<template>
  <a-row>
    <a-col :span="18" :push="3">
      <h1 class="sign-title">提问结果</h1>
      <div v-if="ask_answer.question != undefined">
        <div class="teacher_question">
          问题:&nbsp;{{ ask_answer.question.stem }}
        </div>
        <div class="teacher_question">
          正确答案:&nbsp;{{ ask_answer.question.right_answer }}
        </div>
      </div>
      <a-list
        size="small"
        bordered
        :data-source="ask_answer"
        v-if="ask_answer.length"
      >
        <template #renderItem="item">
          <a-list-item>
            <span class="name"> {{ item.student }} </span>
            <a-tag color="#2db7f5">{{ item.answerSelection }}</a-tag>
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
  mounted() {},
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

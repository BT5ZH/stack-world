<template>
  <a-row>
    <a-col :span="18" :push="3">
      <h1 class="sign-title">抢答结果</h1>
      <div v-if="raceList.length != 0">
        <div class="teacher_question">问题:&nbsp;{{ raceList[0].question.stem }}</div>
        <div class="teacher_question">
          正确答案:&nbsp;{{ raceList[0].question.right_answer }}
        </div>
      </div>
      <a-list size="small" bordered :data-source="raceList" v-if="raceList.length">
        <template #renderItem="item">
          <a-list-item>
            <span class="name"> {{ item.studentName }} </span>
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
  data() {
    return {};
  },

  computed: {
    ...mapState({
      raceList: (state) => state.teacher.raceList,
    }),
  },
  mounted() {},
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
.name {
  font-weight: bold;
  color: #666;
}
</style>

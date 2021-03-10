<template>
  <div style="padding: 2rem">
    <a-list v-if="raceData.start" item-layout="vertical" size="large">
      <a-list-item>
        <multi-ques
          v-if="raceData.question.multiple"
          @submit="submitAnswer"
          :disabled="!raceData.start"
          :btnText="raceData.start ? '提交答案' : '抢答已结束'"
          :item="raceData.question"
        ></multi-ques>
        <single-ques
          v-else
          @submit="submitAnswer"
          :disabled="!raceData.start"
          :btnText="raceData.start ? '提交答案' : '抢答已结束'"
          :item="raceData.question"
        ></single-ques>
      </a-list-item>
    </a-list>
    <a-empty v-else description="暂无抢答题目" />
  </div>
</template>

<script>
import singleQues from "../../../../components/SingleQues.vue";
import multiQues from "../../../../components/MultiQues.vue";
import { mapState } from "vuex";

export default {
  props: {
    socket: {
      required: true,
    },
  },
  components: {
    singleQues,
    multiQues,
  },
  mounted() {
    console.log("daat----");
    console.log(this.raceData);
  },
  computed: {
    ...mapState({
      raceData: (state) => state.student.interaction.race,
      studentName: (state) => state.public.userName,
      studentID: (state) => state.public.uid,
    }),
    lessonId() {
      return this.$route.query.lessonId;
    },
    quesAvailable() {
      return Object.keys(this.raceData.question).length;
    },
  },
  methods: {
    submitAnswer(data) {
      this.socket.sendEvent("joinRoom", {
        actionType: "race",
        role: "student",
        roomId: this.lessonId,
        data: {
          ...data,

          studentName: this.studentName,
          studentID: this.studentID,
          limit: this.raceData.limit,
          question: this.raceData.question,
        },
      });
      //一人不得反复提交
      this.raceData.start = false;
      // 关闭事件徽标
      this.$store.commit("student/updateStudentBadge", {
        event: "race",
        status: false,
      });
    },
  },
};
</script>

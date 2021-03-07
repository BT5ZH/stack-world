<template>
  <div style="padding: 2rem">
    <a-empty v-if="pickData.start == null" description="暂无提问" />
    <a-list v-else item-layout="vertical" size="large">
      <a-list-item>
        <multi-ques
          v-if="pickData.question.multiple"
          @submit="submitAnswer"
          :item="pickData.question"
        ></multi-ques>
        <single-ques
          v-else
          @submit="submitAnswer"
          :item="pickData.question"
        ></single-ques>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import singleQues from "@/components/SingleQues.vue";
import multiQues from "@//components/MultiQues.vue";
import * as UTILS from "@/utils/utils";
import { mapState } from "vuex";

export default {
  props: {
    socket: {
      required: true,
    },
  },
  data() {
    return {
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
    };
  },
  components: {
    singleQues,
    multiQues,
  },
  computed: {
    ...mapState({
      studentName: (state) => state.public.userName,
      studentId: (state) => state.public.studentId,
      pickData: (state) => state.student.interaction.ask,
    }),
    lessonId() {
      return this.$route.query.lessonId;
    },
  },
  onChange(val) {
    if (!val.length) return;
    this.value = [val.pop()];
  },

  methods: {
    submitAnswer(data) {
      //获得当前东八区的时间，并赋值给 now
      let timeZone = 8;
      let offset_GMT = new Date().getTimezoneOffset();
      var nowDate = new Date().getTime();
      var now = new Date(nowDate + offset_GMT * 60 * 1000 + timeZone * 60 * 60 * 1000);

      const answerTime = UTILS.formatDate(now);

      this.socket.sendEvent("joinRoom", {
        actionType: "ask",
        role: "student",
        roomId: this.lessonId,
        studentId: this.studentId,
        data: {
          ...data,
          studentName: this.studentName,
          studentId: this.studentId,
          question: this.pickData.question,
          answerTime: answerTime,
        },
      });
      this.$store.commit("student/updateStudentBadge", {
        event: "test",
        status: false,
      });
    },
  },
  mounted() {
    // console.log("---test_data---");
    // console.log(this.pickData.question);
    // console.log(this.pickData.question);
  },
};
</script>

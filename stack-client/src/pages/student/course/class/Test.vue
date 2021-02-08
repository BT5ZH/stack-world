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
import singleQues from "../../../../components/SingleQues.vue";
import multiQues from "../../../../components/MultiQues.vue";
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
      // console.log(this.value);
      this.socket.sendEvent("joinRoom", {
        actionType: "ask",
        role: "student",
        roomId: this.lessonId,
        data: {
          ...data,
          student: this.studentName,
          question: this.pickData.question,
        },
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

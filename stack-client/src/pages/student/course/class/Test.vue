<template>
  <div style="padding: 2rem">
    <a-empty v-if="pickData.id == null" />
    <a-list v-else item-layout="vertical" size="large">
      <a-list-item>
        {{ pickData.stem }}
        <a-radio-group :style="radioStyle" v-model="value">
          <a-radio
            :style="radioStyle"
            :key="opt.value"
            v-for="opt in pickData.options"
            :value="opt.value"
          >
            {{ opt.text }}
          </a-radio>
        </a-radio-group>
        <br /><br /><br /><br />
        <a-button
          @click="submitAnswer"
          style="width: 100%; margin-top: 20px"
          type="primary"
        >
          提交答案
        </a-button>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
// import singleQues from "../../../../components/SingleQues.vue";
// import multiQues from "../../../../components/MultiQues.vue";
import { mapState } from "vuex";

export default {
  props: {
    socket: {
      required: true,
    },
  },
  data() {
    return {
      value: "",
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
    };
  },
  components: {
    // singleQues,
    // multiQues,
  },
  computed: {
    ...mapState({
      studentName: (state) => state.public.name,
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
    submitAnswer() {
      // console.log(this.value);
      this.socket.sendEvent("joinRoom", {
        actionType: "ask",
        role: "student",
        roomId: this.lessonId,
        data: { value: this.value, student: this.studentName },
      });
    },
  },
  mounted() {
    // console.log("---test_data---");
    // console.log(this.pickData);
    // console.log(this.pickData.question);
  },
};
</script>
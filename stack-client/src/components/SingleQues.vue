<template>
  <div>
    <p>{{ index }}.&nbsp;{{ item.content }}</p>
    <a-radio-group v-model="value" @change="onChange" :value="value">
      <a-radio
        :style="radioStyle"
        :key="opt.value"
        v-for="opt in item.options"
        :value="opt.value"
      >
        {{ opt.text }}
      </a-radio>
    </a-radio-group>
    <br />
    <a-button
      :disabled="disabled"
      @click="submitAnswer"
      style="margin-top: 20px"
      type="primary"
    >
      {{ btnText }}
    </a-button>
    <br />
    <div style="margin-top: 10px" v-show="answerVisible" v-if="item.answer">
      正确答案：{{ item.answer[0] }}&nbsp;&nbsp;|&nbsp;&nbsp;提交答案：{{
        item.student_answer === "Z" ? "未选" : item.student_answer
      }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    parentDisabled: {
      type: Boolean,
      default: false,
    },
    btnText: {
      type: String,
      default: "确 定",
    },
    //////added the index by qichao//////
    index: {
      type: Number,
      default: 0,
    },
    submited: {
      type: Boolean,
      default: false,
    },
    ////////////////////////////////////
  },
  data() {
    return {
      disabled: this.parentDisabled,
      value: "",
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
      //answerVisible:false,
    };
  },
  methods: {
    onChange(val) {
      if (!val.length) return;
      this.value = [val.pop()];
    },
    submitAnswer() {
      this.disabled = true;
      let answer_res = false;
      if (this.item.right_answer == this.value) {
        answer_res = true;
      }
      this.$emit("submit", {
        id: this.item.id,
        answerSelection: this.value,
        answerResult: answer_res,
      });
      ///////////////////////////////////
      this.stuDoQuestion(); // added by qichao
      ///////////////////////////////////
    },
    ///////////added by qichao/////////////
    stuDoQuestion() {
      if (this.item.answer) {
        if (this.value != "") {
          this.$emit("submitExam", {
            id: this.item.id,
            answer: this.value,
            right_answer: this.item.answer[0],
          });
          this.item.student_answer = this.value;
          this.disabled = true;
        } else this.$message.error("请先选择选项");
      }
    },
    ///////////added by qichao/////////////
  },
  computed: {
    answerVisible() {
      if (this.submited) return true;
      else return false;
    },
  },
  mounted() {
    // if(this.disabled) this.answerVisible=true;
    if (this.item.student_answer && this.item.student_answer != "Z")
      this.disabled = true;
  },
};
</script>

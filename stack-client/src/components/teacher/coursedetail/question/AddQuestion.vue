<template>
  <a-modal
    :visible="visible"
    title="添加试题"
    @ok="handleOk"
    width="35%"
    @cancel="$emit('update:visible', false)"
  >
    <a-form-model
      :model="questionForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="题干">
        <a-input v-model="questionForm.stem"></a-input>
      </a-form-model-item>
      <a-form-model-item label="选项">
        <a-input
          v-for="index in optionLength"
          :key="index"
          class="options"
          v-model="questionForm.options[index - 1]"
        >
          <template #prefix>
            <a-button type="primary">{{ index | optionFormatter }}</a-button>
          </template>
          <template #suffix>
            <a-icon type="close" @click="closeOption(index)"></a-icon>
          </template>
        </a-input>
        <a-button type="primary" @click="optionLength++">添加选项</a-button>
      </a-form-model-item>
      <a-form-model-item label="正确答案">
        <a-input v-model="questionForm.right_answer"></a-input>
      </a-form-model-item>
      <a-form-model-item label="题目难度">
        <a-radio-group v-model="questionForm.grade">
          <a-radio :value="1">简单</a-radio>
          <a-radio :value="2">适中</a-radio>
          <a-radio :value="3">困难</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="题目解析">
        <a-textarea v-model="questionForm.analysis"> </a-textarea>
      </a-form-model-item>
      <a-form-model-item label="知识点">
        <a-input v-model="questionForm.knowlege"></a-input>
      </a-form-model-item>
      <a-form-model-item label="关键词">
        <a-input v-model="questionForm.key_word"></a-input>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import axios from "@/utils/axios";

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
      questionForm: {
        stem: "",
        options: [],
        right_answer: "",
        knowlege: "",
        key_word: "",
        grade: 2,
        analysis: "",
        stem_type: "wenzi",
        // TODO 把 knowlege
      },
      optionLength: 2,
    };
  },
  methods: {
    handleOk() {
      // TODO 表单验证
      this.submitAddQuestion();
    },
    closeOption(index) {
      if (this.optionLength <= 2) {
        this.$message.info("选项不能少于两个！");
        return null;
      }
      this.questionForm.options.splice(index - 1, 1);
      this.optionLength--;
    },
    submitAddQuestion() {
      let question_type = this.questionForm.right_answer.length;
      question_type = question_type === 1 ? 2 : 3;
      axios
        .post("pc/v1/questions", {
          teacher_id: this.$store.state.public.uid,
          stem_type: this.questionForm.stem_type,
          question_type,
          lesson_id: this.$route.query.lessonId,
          knowlege: this.questionForm.knowlege,
          key_word: this.questionForm.key_word,
          grade: this.questionForm.grade,
          analysis: this.questionForm.analysis,
          statement: {
            stem: this.questionForm.stem,
            options: this.questionForm.options,
            right_answer: this.questionForm.right_answer,
          },
        })
        .then(({ data }) => {
          if (data.status === "success") {
            this.$message.success("添加试题成功");
            this.$emit("update:visible", false);
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("添加试题失败");
        });
    },
  },
  filters: {
    optionFormatter(value) {
      return String.fromCharCode(64 + value);
    },
  },
};
</script>

<style scoped>
.options {
  padding-left: 30px;
  position: relative;
  right: 10px;
  margin-bottom: 20px;
}
</style>
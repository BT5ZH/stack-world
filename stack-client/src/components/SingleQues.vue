<template>
  <div>
    <p>{{ item.content }}</p>
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
      style="width: 100%; margin-top: 20px"
      type="primary"
    >
      {{ btnText }}
    </a-button>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
    btnText: {
      type: String,
      default: "提交答案",
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
  methods: {
    onChange(val) {
      if (!val.length) return;
      this.value = [val.pop()];
    },
    submitAnswer() {
      this.$emit("submit", {
        id: this.item.id,
        answer: this.value,
      });
    },
  },
};
</script>
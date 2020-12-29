<template>
  <div>
    <p>{{ item.content }}</p>
    <a-checkbox-group @change="onChange" :value="value">
      <a-checkbox
        class="checkStyle"
        :key="opt.value"
        v-for="opt in item.options"
        :value="opt.value"
      >
        {{ opt.text }}
      </a-checkbox>
    </a-checkbox-group>
    <br />
    <a-button
      @click="submitAnswer"
      style="width: 100%; margin-top: 20px"
      type="primary"
    >
      提交答案
    </a-button>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      value: [],
    };
  },
  methods: {
    onChange(val) {
      if (!val.length) return;
      this.value = val;
    },
    submitAnswer() {
      this.$emit("submit", {
        id: this.item.id,
        answer: this.value.sort().join(""),
      });
    },
  },
};
</script>

<style>
.checkStyle {
  display: block;
  height: 30px;
  line-height: 30px;
}
.checkStyle:first-child {
  margin-left: 8px;
}
</style>
<template>
  <div class="setcard ant-card ant-card-bordered">
    <div class="ant-card-head">
      <div class="ant-card-head-wrapper">
        <div class="ant-card-head-title">抢答</div>
      </div>
    </div>
      <a-row type="flex" align="middle" style="padding:0 24px;margin:2px">
        <a-col :span="2"> 抢答名额:</a-col>
        <a-col :span="5">
          <a-input-number
            id="inputNumber"
            v-model="value"
            :min="1"
            :max="1000"
          />
        </a-col>
      </a-row>
      <a-row type="flex" align="bottom" id="div1">
      </a-row>
  </div>
</template>

<script>
import E from "wangeditor";
export default {
  data() {
    return {
      value: 3,
    };
  },
  mounted() {
    const editor = new E("#div1");
    editor.create();
  },
};
</script>
<style scoped>
.w-e-toolbar {
  width: 100%;
}

.w-e-text-container {
  width: 100%;
  height: 100%;
}
</style>
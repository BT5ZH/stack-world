<template>
  <div class="setcard ant-card ant-card-bordered">
    <div class="ant-card-head">
      <div class="ant-card-head-wrapper">
        <div class="ant-card-head-title">提问</div>
      </div>
    </div>
    <div></div>
    <div>
      <div id="div1">
      </div>
    </div>
  </div>
</template>

<script>
import E from 'wangeditor'
export default {
    mounted() {
        const editor = new E('#div1')
        editor.create()
    },
}
</script>
<style>
.w-e-toolbar {
  width: 100%;
}

.w-e-text-container {
  width: 100%;
}
</style>
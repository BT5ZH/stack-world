<template>
  <a-card title="签到" class="setcard">
    <a-row>
      <a-textarea placeholder="Something Input" :rows="10" />
    </a-row>
    <a-row
      type="flex"
      justify="end"
      align="bottom"
      style="position: absolute; bottom: 20px; right: 20px"
    >
      <a-col>
        <a-button type="primary"> 保存 </a-button>
        &nbsp;&nbsp;&nbsp;
        <a-button type="primary"> 取消 </a-button>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
export default {};
</script>
<style>
</style>
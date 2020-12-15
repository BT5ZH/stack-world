<template>
  <a-card title="随堂测试" class="setcard">
    <a-row>
      <a-button><a-icon type="plus" />从资源库选择</a-button>
    </a-row>
    <br />
    <a-row>
      <a-card style="padding: 10px">
        <a-empty />
      </a-card>
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
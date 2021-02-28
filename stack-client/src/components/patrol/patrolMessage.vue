<template>
  <div>
    <a-row>
      <a-col :span="3">
        <leftMenu></leftMenu>
      </a-col>
      <a-col :span="2"></a-col>
      <a-col :span="16">
        <patrolTable></patrolTable>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import leftMenu from "./patrolLeftMenu";
import patrolTable from "./patrolMessage/patrolMessageTable";

export default {
  components: { leftMenu, patrolTable },
  data() {
    return {};
  },
  // methods() {},
};
</script>
<style></style>

<template>
  <div class="container">
      <institution-table class="class-table"></institution-table>
  </div>
</template>

<script>
import InstitutionTable from "./InstitutionTable";

export default {
  components: { InstitutionTable },
};
</script>

<style scoped>
.tree {
  height: 100%;
  border-right: 2px dashed #ccc;
}

.class-table {
  padding-left: 20px;
}

.container {
  padding: 10px;
  height: 100%;
}
</style>

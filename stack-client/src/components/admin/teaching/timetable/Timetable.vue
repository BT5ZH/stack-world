<template>
  <a-row class="container">
   
    <a-col :span="2"></a-col>
    <a-col :span="19">
      <timetable-list class="timetable-list"></timetable-list>
    </a-col>
  </a-row>
</template>

<script>
import TimetableList from "./TimetableList";
import axiosInstance from "@/utils/axios";
import { mapState } from "vuex";

export default {
  components: { TimetableList },
  computed: {
    ...mapState({
      oid: (state) => state.public.oid,
      uid: (state) => state.public.uid,
      org_name:(state)=>state.public.org_name,
    }),
  },
   mounted() {

    //this.$store.dispatch("public/getOrgnizationName", this.oid);
  },
  
  
  
};
</script>

<style scoped>
.class-table {
  padding-left: 20px;
}

.container {
  padding: 10px;
  height: 100%;
}
</style>

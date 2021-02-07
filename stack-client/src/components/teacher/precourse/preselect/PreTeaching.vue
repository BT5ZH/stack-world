<template>
  <div>
    <a-card title="讲课" class="setcard"> ppt: {{ this.ppt.PPT.name }} </a-card>

    <br />
    <a-button type="primary" @click="on_pptvisible"> 选择PPT </a-button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      curCourseHour: (state) => state.teacher.curCourseHour,
      // ppt:(state)=> state.teacher.courseHours
    }),
    ppt() {
      if (this.$store.state.teacher.courseHours[this.curCourseHour])
        return this.$store.state.teacher.courseHours[this.curCourseHour];
      else return "";
    },
  },
  methods: {
    on_pptvisible() {
      this.$emit("selectppt", true);
    },
  },
};
</script>

<style scoped>
</style>
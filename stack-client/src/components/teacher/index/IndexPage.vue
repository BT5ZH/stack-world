<template>
  <div>
    <course-calendar />
    <!-- <recent-edit /> -->
    <index/>
  </div>
</template>

<script>
import CourseCalendar from "./CourseCalendar";
//import RecentEdit from "./RecentEdit";
import Index from "./../course/Index.vue"

export default {
  //components: { CourseCalendar, RecentEdit },
  components: { CourseCalendar, Index },
  data() {
    return {};
  },
  methods: {},
  created() {},
};
</script>

<style scoped>
</style>
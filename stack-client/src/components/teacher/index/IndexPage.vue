<template>
  <div>
    <course-calendar />
    <!-- <recent-edit /> -->
    <course/>
  </div>
</template>

<script>
import CourseCalendar from "./CourseCalendar";
//import RecentEdit from "./RecentEdit";
import Course from "./../course/Course.vue"

export default {
  //components: { CourseCalendar, RecentEdit },
  components: { CourseCalendar, Course },
  data() {
    return {};
  },
  methods: {},
  created() {},
};
</script>

<style scoped>
</style>
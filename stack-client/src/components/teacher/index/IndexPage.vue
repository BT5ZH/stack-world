<template>
  <div>
    <course-calendar />
    <course />
  </div>
</template>

<script>
import CourseCalendar from "./CourseCalendar";
import Course from "./../course/Course.vue";

export default {
  components: { CourseCalendar, Course },
  data() {
    return {};
  },
  methods: {},
  created() {},
};
</script>

<style scoped></style>

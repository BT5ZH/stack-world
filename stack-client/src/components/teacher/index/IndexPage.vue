<template>
  <div>
    <course-calendar />
    <recent-edit />
  </div>
</template>

<script>
import CourseCalendar from "./CourseCalendar";
import RecentEdit from "./RecentEdit";

export default {
  components: { CourseCalendar, RecentEdit },
  data() {
    return {};
  },
  methods: {},
  created() {},
};
</script>

<style scoped>
</style>
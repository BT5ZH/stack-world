<template>
  <a-row :gutter="[8, 8]">
    <a-col :span="12" :key="item.id" v-for="item in courseList">
      <course-card :item="item" style="color: #fff"></course-card>
    </a-col>
  </a-row>
</template>

<script>
import { mapState } from "vuex";

import courseCard from "@/components/student/cards/CourseCard.vue";

export default {
  name: "CourseCatalog",
  components: {
    courseCard,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    // jmpRoute(item){
    //     this.$router.push({ path: item.route,query: { title: item.name } });
    // }
  },
  created: function () {
      console.log(this.$store);
  },
  computed: {
    ...mapState({
      courseList: (state) => {
        console.log(state);
        return "state.student.courseList;"
      },
    }),
  },
};
</script>
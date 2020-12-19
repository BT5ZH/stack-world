<template>
  <div>
    <a-empty v-if='courseList.length==0' />
    <a-row v-else :gutter="[8, 8]">
      <a-col :span="12" :key="item.id" v-for="item in courseList">
        <course-card :item="item" style="color: #fff;"></course-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapState } from "vuex";

import courseCard from "../../../components/student/CourseCard.vue";

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
  created: function() {},
  computed: {
    ...mapState({
      courseList: (state) => state.student.courseList,
    }),
  },
};
</script>

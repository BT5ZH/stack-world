<template>
  <a-row class="container">
    <a-row :span="20" style="margin: 10px 25px 20px 5px;">
      <!-- <a-tree-select
        style="width: 100%"
        :value="value"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :placeholder="orgName"
        allow-clear
        tree-default-expand-all
        @change="onChange"
        @search="onSearch"
        @select="onSelect"
      >
        <a-tree-select-node
          :key="campus.campus_name"
          :value="campus.campus_name"
          :title="campus.campus_name"
          v-for="campus in campusList"
        >
          <a-tree-select-node
            :key="buildings.name"
            :value="`${buildings._id}:${buildings.name}`"
            :title="buildings.name"
            v-for="buildings in campus.buildings"
          >
          </a-tree-select-node>
        </a-tree-select-node>
      </a-tree-select> -->
    </a-row>
    <a-col :span="20">
      <course-table class="class-table" :courses="courseList"></course-table>
    </a-col>
  </a-row>
</template>

<script>
import CourseTable from "./CourseTable";
import axiosInstance from "@/utils/axios";
export default {
  components: { CourseTable },
  data() {
    return {
      courseList: [],
    };
  },
  mounted() {
    this.getCourses();
  },
  methods: {
    async getCourses() {
      let queryString = "";
      const url = "/pc/v1/courses" + queryString;
      try {
        const { data } = await axiosInstance.get(url);
        this.courseList = data.courses;
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    },
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

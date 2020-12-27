<template>
  <a-row class="container">
    <a-row :span="20" style="margin: 10px 25px 20px 5px;">
      <a-tree-select
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
          :key="item._id"
          :value="item._id"
          :title="item._id"
          v-for="item in treeData"
        >
          <a-tree-select-node
            :key="mName"
            :value="`${mName}:${item.subOrg_name}`"
            :title="mName"
            v-for="mName in item.majors"
          >
          </a-tree-select-node>
        </a-tree-select-node>
      </a-tree-select>
    </a-row>
    <a-row :span="20">
      <course-table class="class-table" :courses="courseList"></course-table>
    </a-row>
    <a-row :span="20">
      <course-dashboard
        class="class-dashboard"
        :courses="courseList"
      ></course-dashboard>
    </a-row>
  </a-row>
</template>

<script>
import courseTable from "./CourseTable";
import courseDashboard from "./CourseTree";
import axiosInstance from "@/utils/axios";
import { mapState } from "vuex";

export default {
  components: { courseTable, courseDashboard },
  data() {
    return {
      value: undefined,
      courseList: [],
      treeData: [],
    };
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
      oid: (state) => state.public.oid,
      orgName: (state) => state.public.org_name,
    }),
  },
  mounted() {
    this.getTreeData();
    this.getCourses();
  },
  methods: {
    async getTreeData() {
      let queryString = this.orgName;
      const url = "/pc/v1/courses/courseTree?org_name=" + queryString;
      console.log(url);
      try {
        const { data } = await axiosInstance.get(url);
        console.log(data.data);
        this.treeData = data.data;
      } catch (err) {
        console.log(err);
      }
    },
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
    async onChange(data) {
      console.log("onchange:   " + data);

      // this.value = data;
    },
    onSearch() {
      console.log(...arguments);
    },
    onSelect() {
      console.log("selected:   ");
      console.log(...arguments);
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

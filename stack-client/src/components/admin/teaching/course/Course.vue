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
          :value="`${item._id}#`"
          :title="item._id"
          v-for="item in treeData"
        >
          <a-tree-select-node
            :key="mName"
            :value="`${mName}:${item._id}`"
            :title="mName"
            v-for="mName in item.majors"
          >
          </a-tree-select-node>
        </a-tree-select-node>
      </a-tree-select>
    </a-row>
    <a-row :span="20">
      <a-tabs :active-key="activeIndex" @change="callback">
        <a-tab-pane key="1" tab="统计信息" force-render>
          <course-dashboard
            class="class-dashboard"
            :courseProp="courseNumber"
            :majorProp="majorNumber"
            :collegeProp="collegeNumber"
            :pieProp="pieArr"
          ></course-dashboard>
        </a-tab-pane>
        <a-tab-pane key="2" tab="详情">
          <course-table
            class="class-table"
            :courses="courseList"
          ></course-table>
        </a-tab-pane>
      </a-tabs>
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
      collogeName: "",
      activeIndex: "1",
      flag: "",
      collegeNumber: 0,
      majorNumber: 0,
      courseNumber: 0,
      pieArr: [],
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
    // this.getCourses();
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
        this.collegeNumber = this.treeData.length;
        let mNumber = 0;
        let cNumber = 0;
        let tempArr = [];
        this.treeData.forEach((item, index) => {
          let pieObj = {};
          pieObj.name = item._id;

          item.majors.forEach(() => {
            mNumber++;
          });
          pieObj.value = mNumber;
          tempArr.push(pieObj);
          cNumber += item.course_number;
        });
        this.pieArr = tempArr;
        this.majorNumber = mNumber;
        this.courseNumber = cNumber;
      } catch (err) {
        console.log(err);
      }
    },
    // async getCourses() {
    //   let queryString = "";
    //   const url = "/pc/v1/courses" + queryString;
    //   try {
    //     const { data } = await axiosInstance.get(url);
    //     this.courseList = data.courses;
    //     console.log(data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },

    async getCoursesFromCondition(payload) {
      let queryString = "";
      Object.keys(payload).forEach((key) => {
        queryString += key + "=" + payload[key] + "&";
      });
      queryString = "?" + queryString.slice(0, -1);
      const url = "/pc/v1/courses" + queryString;
      try {
        const { data } = await axiosInstance.get(url);
        this.courseList = data.courses;
        console.log(this.courseList);
      } catch (err) {
        console.log(err);
      }
    },
    onChange(data) {
      console.log("onchange:   " + data);
      this.activeIndex = "2";
      this.collogeName = data;
      this.flag = data;
      this.callback("2");

      this.value = data;
    },
    onSearch() {
      console.log(...arguments);
    },
    onSelect() {
      console.log("selected:   ");
      console.log(...arguments);
    },
    callback(key) {
      console.log(key);
      if (key == "1") {
        this.activeIndex = "1";
      } else if (key == "2") {
        let payload = {};
        this.activeIndex = "2";
        if (this.flag.slice(-1) == "#") {
          let temp = this.flag.slice(0, -1);
          payload = { subOrg_name: temp };
          this.getCoursesFromCondition(payload);
        } else {
          let dataArray = this.flag.split(":");
          payload = { subOrg_name: dataArray[1], major_name: dataArray[0] };
          this.getCoursesFromCondition(payload);
        }
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

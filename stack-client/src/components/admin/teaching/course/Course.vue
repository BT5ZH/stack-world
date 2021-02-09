<template>
  <a-row class="container">
    <a-row :span="20" style="margin: 10px 25px 20px 5px">
      <a-spin :spinning="Tree_spin_status" tip="Loading...">
        <a-tree-select
          style="width: 100%"
          :value="value"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :placeholder="orgName"
          allow-clear
          tree-default-expand-all
          @change="onChange"
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
      </a-spin>
    </a-row>
    <batchAddCourse :visible.sync="bulkImport_visible"></batchAddCourse>
    <a-row class="btn-area">
      <a-col :span="5">
        <a-input-search placeholder="课程编号/名称" enter-button />
        <!-- @search="onSearch" -->
      </a-col>
      <a-col :span="10"></a-col>
      <a-col :span="9" class="btn">
        <a-space>
          <a-button type="primary" @click="bulkImport_visible = true"
            >批量添加课程</a-button
          >
          <a-button type="primary" disabled>添加课程</a-button>
          <a-button type="primary" disabled>批量删除</a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-row :span="20">
      <a-tabs :active-key="activeIndex" @change="callback">
        <a-tab-pane key="1" tab="简介" force-render>
          <a-spin :spinning="spin_status" tip="Loading...">
            <course-dashboard
              class="class-dashboard"
              :courseProp="courseList"
              :collegeName="value"
            ></course-dashboard>
          </a-spin>
        </a-tab-pane>

        <a-tab-pane key="2" tab="课程">
          <a-spin :spinning="spin_status" tip="Loading...">
            <course-table
              class="class-table"
              :courses="courseList2"
            ></course-table>
          </a-spin>
        </a-tab-pane>
      </a-tabs>
    </a-row>
  </a-row>
</template>

<script>
import batchAddCourse from "./BatchAddCourse.vue";
import courseTable from "./CourseTable";
import courseDashboard from "./CourseTree";
// import axiosInstance from "@/utils/axios";
import { mapState } from "vuex";

export default {
  components: { courseTable, courseDashboard, batchAddCourse },
  data() {
    return {
      bulkImport_visible: false,
      value: undefined,
      courseList: [],
      courseList2: [],
      treeData: [],
      collogeName: "",
      activeIndex: "1",
      flag: "",
      collegeList: [],
      majorList: [],
      collegeNumber: 0,
      majorNumber: 0,
      courseNumber: 0,
      pieArr: [],
    };
  },
  computed: {
    ...mapState({
      Tree_spin_status: (state) => state.admin.Tree_spin_status,
      spin_status: (state) => state.admin.spin_status,
      uid: (state) => state.public.uid,
      oid: (state) => state.public.oid,
      orgName: (state) => state.public.orgName,
    }),
  },
  mounted() {
    this.getTreeData();
  },
  methods: {
    // async
    getTreeData() {
      let queryString = this.orgName;
      const url = "/pc/v1/courses/courseTree?org_name=" + queryString;
      // console.log(url);

      this.$store
        .dispatch("admin/getTreeByURLwithSpin", url)
        .then((response) => {
          console.log("--------coursesTree--------");
          console.log(response);
          this.treeData = response.data.data;
          this.courseNumber = response.data.totalCourseNumber;
          this.collegeNumber = this.treeData.length;

          let mNumber = 0;
          let tempArr = [];
          this.treeData.forEach((item, index) => {
            let pieObj = {};
            pieObj.name = item._id;
            item.majors.forEach(() => {
              mNumber++;
            });
            pieObj.value = mNumber;
            tempArr.push(pieObj);
          });
          this.pieArr = tempArr;
          this.majorNumber = mNumber;
        })
        .catch((error) => {
          console.log(error);
        });

      // try {
      //   this.$store.dispatch("admin/change_Tree_spin_status", true);
      //   const { data } = await axiosInstance.get(url);
      //   this.$store.dispatch("admin/change_Tree_spin_status", false);
      //   // console.log(data);
      //   this.treeData = data.data;
      //   this.courseNumber = data.totalCourseNumber;
      //   this.collegeNumber = this.treeData.length;

      //   let mNumber = 0;
      //   let tempArr = [];
      //   this.treeData.forEach((item, index) => {
      //     let pieObj = {};
      //     pieObj.name = item._id;
      //     item.majors.forEach(() => {
      //       mNumber++;
      //     });
      //     pieObj.value = mNumber;
      //     tempArr.push(pieObj);
      //   });
      //   this.pieArr = tempArr;
      //   this.majorNumber = mNumber;
      // } catch (err) {
      //   console.log(err);
      // }
    },

    // async
    getCoursesFromCondition(payload, type) {
      let queryString = "";
      Object.keys(payload).forEach((key) => {
        queryString += key + "=" + payload[key] + "&";
      });
      queryString = "?" + queryString.slice(0, -1);
      const url = "/pc/v1/courses" + queryString;

      this.$store
        .dispatch("admin/getTreeByURLwithSpin", url)
        .then((response) => {
          console.log("--------- courses--------");
          console.log(response);
          if (type == 1) {
            this.courseList = response.data.courses;
            // console.log(this.courseList);
          } else if (type == 2) {
            this.courseList2 = response.data.courses;
            // console.log(this.courseList2);
          }
        })
        .catch((error) => {
          console.log(error);
        });

      // console.log(url);
      // try {
      //   this.$store.dispatch("admin/change_spin_status", true);
      //   const { data } = await axiosInstance.get(url);
      //   this.$store.dispatch("admin/change_spin_status", false);
      //   if (type == 1) {
      //     this.courseList = data.courses;
      //     // console.log(this.courseList);
      //   } else if (type == 2) {
      //     this.courseList2 = data.courses;
      //     // console.log(this.courseList2);
      //   }
      // } catch (err) {
      //   console.log(err);
      // }
    },
    async onChange(value, label) {
      // console.log("onchange:  value " + value);
      // console.log("onchange:   label" + label);
      this.flag = value;
      if (this.flag.slice(-1) == "#") {
        let payload = {};
        this.activeIndex = "1";
        let temp = this.flag.slice(0, -1);
        payload = { subOrg_name: temp };
        this.getCoursesFromCondition(payload, 1);
      } else {
        let payload = {};
        this.activeIndex = "2";
        let dataArray = this.flag.split(":");
        payload = { subOrg_name: dataArray[1], major_name: dataArray[0] };
        // console.log(payload);
        this.getCoursesFromCondition(payload, 2);

        // console.log("代码出差");
      }
      // console.log(label);
      this.value = label;
    },
    callback() {},
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

<template>
  <a-row class="container" :style="{ height: containerHeight }">
    <a-row class="cards-area" :gutter="30">
      <a-col :span="6" v-for="(course, index) in courses" :key="index">
        <!-- <a-card style="margin-top: 15px" size="small">
          <img
            slot="cover"
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
          <a-row type="flex" justify="space-between">
            <a-col :span="10">
              <h3>{{ course.lesson_name }}</h3>
            </a-col>
            <a-col :span="8">
              <span style="float: left; color: #bbb">
                {{ course | progressFilter }}
              </span>
            </a-col>
          </a-row>
          <template slot="actions" class="ant-card-actions">
            <a-button type="link" size="small" @click="ViewCourseInfo(index)">
              详情
            </a-button>
            <a-button type="link" size="small" @click="prepareCourse(index)"
              >备课</a-button
            >
          </template>
        </a-card> -->
        <a-card
          class="space"
          :style="{
            backgroundColor: `${
              courseMap[course.course_id.course_type]['color']
            }`,
          }"
          @click="prepareCourse(index)"
        >
          <a-icon
            :type="courseMap[course.course_id.course_type]['icon']"
            class="room_icon"
          />
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            "
          >
            <!-- <a-checkbox
              @change="onChange($event, course.lesson_name)"
            ></a-checkbox> -->
            <p>{{ course.course_id.name }}</p>
            <a-tag color="#2db7f5">{{ course.course_id.evaluation }}</a-tag>
            <a-tag color="#ffb900">{{
              courseMap[course.course_id.course_type]["name"]
            }}</a-tag>
            <a-icon type="right-circle" style="font-size: 20px" />
          </div>
          <div>
            <p>课程负责人：{{ course.teacher_id.name }}</p>
            <p>代课老师：{{ course.teacher_id.name }}</p>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <!-- <a-row type="flex">
      <a-pagination
        class="pagination"
        :total="courses.length"
        :page-size="2"
      ></a-pagination>
    </a-row> -->
  </a-row>
</template>

<script>
import courseLayout from "@/utils/userConst";
import { mapState } from "vuex";

export default {
  data() {
    return {
      courseMap: courseLayout.courseMap,
      // courseMap: {
      //   专业核心课程: { name: "专业核心课程", color: "#96BFFF", icon: "home" },
      //   基础课: { name: "基础课", color: "#FFDB5C", icon: "experiment" },
      //   专业方向课程: {
      //     name: "专业方向课程",
      //     color: "#9FE6B8",
      //     icon: "bank",
      //   },
      //   专业必修课: { name: "专业必修课", color: "#ff9f7f", icon: "question" },
      //   专业技能课程: {
      //     name: "专业必修课",
      //     color: "#ff9f7f",
      //     icon: "question",
      //   },
      //   其他: { name: "其他", color: "#e7bcf3", icon: "bank" },
      // },
    };
  },
  methods: {
    onSearch() {},
    ViewCourseInfo(courseIndex) {
      const lessonId = this.courses[courseIndex]._id;
      this.$router.push({
        name: "teacher_coursedetail",
        query: { lessonId },
      });
    },
    prepareCourse(courseIndex) {
      const lessonId = this.courses[courseIndex]._id;
      let recentCourses = localStorage.getItem("recent-courses") || "[]";
      recentCourses = JSON.parse(recentCourses);
      let curCourse = recentCourses.findIndex((item) => item._id === lessonId);
      // console.log(curCourse);
      if (curCourse >= 0) {
        recentCourses.splice(curCourse, 1);
      }
      recentCourses.unshift(this.courses[courseIndex]);
      localStorage.setItem(
        "recent-courses",
        JSON.stringify(Array.from(new Set(recentCourses)).slice(0, 4))
      );
      const lessonName = this.courses[courseIndex].lesson_name;
      this.$router.push({
        name: "teacher_precourse",
        query: {
          lessonId,
          lessonName,
          prepareNumber: this.courses[courseIndex].prepareNumber,
        },
      });
    },
  },
  computed: {
    containerHeight() {
      const height = window.innerHeight;
      return `${height - 220}px`;
    },
    ...mapState({
      uid: (state) => state.public.uid,
      courses: (state) => state.teacher.courses,
    }),
  },
  // watch: {
  //   courses: {
  //     immediate: true,
  //     handler(value) {
  //       console.log(value);
  //       this.courses = value;
  //     },
  //   },
  // },
  filters: {
    progressFilter({ prepareNumber, total_study_hours }) {
      return `已备${prepareNumber}课时/共${total_study_hours}课时`;
    },
  },
  mounted() {
    this.$store.dispatch("teacher/getTeacherCourses", this.uid);
  },
};
</script>

<style scoped>
.pagination {
  margin-top: 20px;
}
.container {
  height: 100%;
  overflow-y: auto;
  margin-top: 10px;
}
.space {
  cursor: pointer;
}
.room_icon {
  min-height: 100%;
  font-size: 80px;
  position: absolute;
  top: 35%;
  right: -5%;
  color: #fff;
  opacity: 0.4;
}
</style>

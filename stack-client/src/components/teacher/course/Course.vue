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
          <a-row type="flex" justify="space-between" >
            <a-col :span="10" >
              <h3 style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ course.lesson_name }}</h3>
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
            <p>代课老师：{{ course.teacher_id.name }}</p>
            <a-tag color="#2db7f5">{{ course.course_id.evaluation }}</a-tag>
            <a-tag color="#ffb900"
              >共{{ course.course_id.total_study_hours }}课时</a-tag
            >
            <a-icon type="right-circle" style="font-size: 20px" />
          </div>
          <div>
            <p>课程名：{{ course.course_id.name }}</p>
            <p>
              课程类型：{{ courseMap[course.course_id.course_type]["name"] }}
            </p>
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
      console.log(this.courses[courseIndex]);
      if (curCourse >= 0) {
        recentCourses.splice(curCourse, 1);
      }
      recentCourses.unshift(this.courses[courseIndex]);
      localStorage.setItem(
        "recent-courses",
        JSON.stringify(Array.from(new Set(recentCourses)).slice(0, 4))
      );
      // const lessonName = this.courses[courseIndex].lesson_name;
      this.$router.push({
        name: "teacher_precourse",
        query: {
          lessonId,
          lessonName: this.courses[courseIndex].course_id.name,
          prepareNumber: this.courses[courseIndex].prepareLesson.length,
          courseHours: this.courses[courseIndex].course_id.total_study_hours,
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

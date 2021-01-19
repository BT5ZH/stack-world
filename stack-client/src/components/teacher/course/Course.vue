<template>
  <a-row class="container" :style="{ height: containerHeight }">
    <a-row class="cards-area" :gutter="30">
      <a-col :span="6" v-for="(course, index) in courses" :key="index">
        <a-card
          class="space"
          :style="{
            backgroundColor: `${
              courseMap[course.course_type]['color']
            }`,
          }"
          @click="prepareCourse(index)"
        >
          <a-icon
            :type="courseMap[course.course_type]['icon']"
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
            <p>代课老师：{{ course.teacher_name }}</p>
            <a-tag color="#2db7f5">{{ course.evaluation }}</a-tag>
            <a-tag color="#ffb900"
              >共{{ course.total_study_hours }}课时</a-tag
            >
            <a-icon type="right-circle" style="font-size: 20px" />
          </div>
          <div>
            <p>课程名：{{ course.lesson_name }}</p>
            <p>
              课程类型：{{ courseMap[course.course_type]["name"] }}
            </p>
          </div>
        </a-card>
      </a-col>
    </a-row>
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
    prepareCourse(courseIndex) {
      const lessonId = this.courses[courseIndex]._id;
      let recentCourses = localStorage.getItem("recent-courses") || "[]";
      recentCourses = JSON.parse(recentCourses);
      let curCourse = recentCourses.findIndex((item) => item._id === lessonId);
      if (curCourse >= 0) {
        recentCourses.splice(curCourse, 1);
      }
      recentCourses.unshift(this.courses[courseIndex]);
      localStorage.setItem(
        "recent-courses",
        JSON.stringify(Array.from(new Set(recentCourses)).slice(0, 4))
      );
      this.$router.push({
        name: "teacher_precourse",
        query: {
          lessonId,
          lessonName: this.courses[courseIndex].name,
          prepareNumber: this.courses[courseIndex].prepareNumber,
          courseHours: this.courses[courseIndex].total_study_hours,
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

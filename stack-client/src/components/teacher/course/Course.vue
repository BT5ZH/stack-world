<template>
  <a-row class="container" :style="{ height: containerHeight }">
    <a-row>
      <a-col :span="5">
        <a-input-search
          placeholder="课程名称"
          enter-button
          @search="onSearch"
        />
      </a-col>
      <a-col :span="16"></a-col>
      <!-- <a-col :span="3">
        <a-button type="primary" @click="addVisible = true">新建课程</a-button>
      </a-col> -->
    </a-row>
    <a-row class="cards-area" :gutter="30">
      <a-col :span="6" v-for="(course, index) in courses" :key="index">
        <a-card style="margin-top: 15px" size="small">
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
        </a-card>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center">
      <a-pagination
        class="pagination"
        :total="50"
        :show-size-changer="true"
        :show-quick-jumper="true"
      ></a-pagination>
    </a-row>
  </a-row>
</template>

<script>
import axios from "@/utils/axios";
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  methods: {
    onSearch() {},
    ViewCourseInfo(courseIndex) {
      const courseId = this.courses[courseIndex]._id;
      this.$router.push({
        name: "teacher_coursedetail",
        query: { courseId },
      });
    },
    prepareCourse(courseIndex) {
      const courseId = this.courses[courseIndex]._id;
      this.$router.push({
        name: "teacher_precourse",
        query: { courseId },
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
      return `${prepareNumber}备课/${total_study_hours}课时`;
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
}
</style>
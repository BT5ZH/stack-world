<template>
  <div>
    <!-- 直播房间列表 -->
    <a @click="backTo" style="color: blue">返 回</a>
    <div class="title">当天课程</div>
    <a-space class="patrolTable">
      <div
        v-for="(course, index) in patrolMessage"
        :key="index"
        class="patrolCard"
        :style="{
          backgroundColor: `${courseMap[course.course.course_type]['color']}`,
        }"
        @click="goLook(course)"
      >
        <p>代课老师：{{ course.teacher.name }}</p>
        <p>课程名：{{ course.course.name }}</p>
        <p>上课教室：{{ course.room.room_number }}</p>
        <p class="livingStatus">
          {{ course.room.room_status == "living" ? "老师正在直播" : "老师还没开始直播" }}
        </p>
      </div>
      <!-- <p>课程类型：{{ courseMap[course.course.course_type]["name"] }}</p> -->
    </a-space>
  </div>
</template>
<script>
import { mapState } from "vuex";
import axiosInstance from "@/utils/axios";

import courseLayout from "@/utils/userConst";

export default {
  props: {
    patrolMessage: Array,
  },
  data() {
    return {
      courseMap: courseLayout.courseMap,
    };
  },
  mounted() {},
  methods: {
    backTo() {
      this.$emit("goInfo", [], "patrolSchedule");
    },
    goLook(course) {
      if (
        course.room.room_status == "living" &&
        course.room.living_lessonID == course.lesson_id
      ) {
        this.$router.push({
          path: "/patrol/detail",
          query: { lessonId: course.lesson_id },
        });
      } else {
        this.$message.error("老师还没有开始直播哦");
      }
    },
  },
  computed: {
    ...mapState({
      orgName: (state) => state.public.orgName,
      treeData: (state) => state.patrol.patrolTree,
      oid: (state) => state.public.oid,
    }),
  },
};
</script>
<style>
.title {
  display: flex;
  justify-content: center;
  font-size: 20px;
  color: black;
}
.patrolTable {
  display: flex;
  flex-direction: row;
}
.patrolCard {
  width: 250px;
  height: 150px;
  cursor: pointer;
}
.livingStatus {
  display: flex;
  justify-content: center;
}
.quit {
}
</style>

<template>
  <a-row class="container">
    <a-row type="flex" justify="space-around" class="calendar">
      <a-col v-for="item in oneWeek" :key="item.title" :span="3">
        <p align="center">{{ item.title }}</p>
        <p align="center">
          <a-badge :dot="weekBadages[item.titleEn]" :offset="[0, 0]">
            <span
              class="week-day"
              align="center"
              @click="switchToday(item.day, item.titleEn)"
              :style="{
                background:
                  item.titleEn === today.title ? '#13c2c2' : '#409EFF',
              }"
              >{{ item.day }}</span
            >
          </a-badge>
        </p>
      </a-col>
    </a-row>
    <a-row v-if="todayCourses.length">
      <a-row
        class="course-row"
        type="flex"
        justify="center"
        v-for="(item, index) in todayCourses"
        :key="index"
        :gutter="20"
      >
        <a-col :span="3">
          <span style="font-weight: bold">{{ item.courseName }}</span>
        </a-col>
        <a-col :span="6">
          <span>第{{ item.order }}节课 &nbsp;</span>
          <a-tag color="#87d068" v-if="item.oddEven === 0">全学期</a-tag>
          <a-tag color="#2db7f5" v-else-if="item.oddEven === 1">单周上</a-tag>
          <a-tag color="#2db7f5" v-else>双周上</a-tag>
        </a-col>
        <a-col :span="6">
          <span>{{ item.className }}</span>
        </a-col>
        <a-col :span="3">
          <span>{{ item.roomName }}</span>
        </a-col>
        <a-col :span="3">
          <a-button @click="classBegin(item)" type="primary">开始上课</a-button>
        </a-col>
      </a-row>
    </a-row>
    <a-row v-else type="flex" justify="center">
      <div class="course-empty">
        <a-empty description="今天暂无课程" />
      </div>
    </a-row>
  </a-row>
</template>

<script>
import axios from "@/utils/axios";
import moment from "moment";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

export default {
  data() {
    let oneWeek = [
      { title: "一", titleEn: "Mon" },
      { title: "二", titleEn: "Tue" },
      { title: "三", titleEn: "Wed" },
      { title: "四", titleEn: "Thu" },
      { title: "五", titleEn: "Fri" },
      { title: "六", titleEn: "Sat" },
      { title: "七", titleEn: "Sun" },
    ];
    return { oneWeek };
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
      courseCalendar: (state) => state.teacher.courseCalendar,
      today: (state) => state.teacher.today,
      orgName: (state) => state.public.org_name,
      teacherName: (state) => state.public.name,
    }),
    ...mapGetters({
      todayCourses: "teacher/todayCourses",
      weekBadages: "teacher/weekBadages",
    }),
  },
  methods: {
    initOneWeek() {
      let instance = moment().weekday(0);
      this.oneWeek.forEach((item, index) => {
        item.day = instance.date();
        instance.add(1, "d");
      });
      this.updateToday(moment().date(), moment().day());
    },
    updateToday(day, index) {
      let weekTable = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      this.switchToday(day, weekTable[index]);
    },
    switchToday(day, title) {
      this.$store.commit("teacher/updateToday", { day, title });
    },
    classBegin(course) {
      const config = { params: { activityID: course.lessonId } };
      const requestData = {
        activityID: course.lessonId,
        activityNumber: 2,
        activityLocation: course.roomName,
        org: this.orgName,
        subOrg: "计算机科学学院",
        teacher: this.teacherName,
      };
      axios
        .post("pc/v1/activities", requestData, config)
        .then(({ data }) => {
          if (!data.data.activityID) {
            throw "create room fail";
          }
          this.$router.push({
            name: "interaction_index",
            query: { lessonId: course.lessonId },
          });
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("创建房间失败");
        });
    },
  },
  created() {
    this.initOneWeek();
  },
  mounted() {
    if (!this.todayCourses.length) {
      this.$store.dispatch("teacher/getCourseCalendar", this.uid);
    }
  },
};
</script>

<style scoped>
.card {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.week-day {
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: block;
  border-radius: 50%;
  background-color: #409eff;
  padding: 8px;
  color: #fff;
}

.course-row {
  background: #eee;
}

.course-row,
.course-empty {
  padding: 20px;
  margin: 10px 50px;
  border-radius: 10px;
  font-size: 20px;
}

.container {
  background-color: #f0f2f5;
  padding: 15px;
}

.calendar {
  background: #fff;
}

.recent-edit {
  margin-top: 20px;
}
</style>
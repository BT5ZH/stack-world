<template>
  <a-card style="margin-top: 0.8rem" :bodyStyle="{ padding: '2rem' }">
    <a-row type="flex" justify="space-around">
      <a-col v-for="item in oneWeek" :key="item.title" :span="3">
        <a-badge :dot="weekbadage[item.titleNumber - 1]">
          <span
            :class="item.titleNumber == day ? 'my-col col-active' : 'my-col'"
            @click="day = item.titleNumber"
            >{{ item.title }}</span
          >
        </a-badge>
      </a-col>
    </a-row>

    <div v-if="currentList.length == 0">
      <p style="text-align: center; margin-top: 1.2rem">今日暂无课程</p>
    </div>
    <div
      v-else
      :key="item.course_id"
      v-for="item in currentList"
      @click="jmpRoute(item)"
      class="schedule_card"
      :style="item.style"
    >
      <div class="flexbox">
        <h3 style="color: #fff">{{ item.course_name }}</h3>
        <a-tag color="blue" style="height: fit-content">
          {{ item.curriculum[nowIndex].odd }}
        </a-tag>
        <a-tag color="green" style="height: fit-content">
          {{ item.curriculum[nowIndex].time }}
        </a-tag>
        <a-icon
          type="right-circle"
          style="font-size: 2rem; margin-top: 0.5rem"
        />
      </div>
      <div class="flexbox">
        <h4 style="color: #fff">{{ item.teacher }}</h4>
        <p>{{ item.curriculum[nowIndex].classroom }}</p>
      </div>
    </div>
  </a-card>
</template>

<script>
import { mapState } from "vuex";
// import moment from 'moment';

export default {
  name: "ScheduleCard",
  data() {
    let oneWeek = [
      { title: "一", titleNumber: 1 },
      { title: "二", titleNumber: 2 },
      { title: "三", titleNumber: 3 },
      { title: "四", titleNumber: 4 },
      { title: "五", titleNumber: 5 },
      { title: "六", titleNumber: 6 },
      { title: "七", titleNumber: 7 },
    ];
    return {
      weekbadage: [false, false, false, false, false, false, false],
      oneWeek,
      nowTime: new Date(),
      day: 1,
      nowIndex: -1,
      currentList: [],
    };
  },
  watch: {
    day: function () {
      this.changeSchedule(this.day);
    },
  },
  created() {
    this.courseList.map((item) => {
      item.curriculum.map((temp) => {
        switch (temp.week) {
          case 1:
            this.weekbadage[0] = true;
            break;
          case 2:
            this.weekbadage[1] = true;
            break;
          case 3:
            this.weekbadage[2] = true;
            break;
          case 4:
            this.weekbadage[3] = true;
            break;
          case 5:
            this.weekbadage[4] = true;
            break;
          case 6:
            this.weekbadage[5] = true;
            break;
          case 7:
            this.weekbadage[6] = true;
            break;
        }
      });
    });
  },
  mounted() {
    this.getCourse();
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
      courseList: (state) => state.student.courseList,
      user: (state) => state.student.user,
    }),
  },
  methods: {
    getCourse() {
      let date = this.nowTime;
      let year = date.getFullYear();
      //  + '-' + Number(date.getFullYear() + 1);
      let semester = date.getMonth() < 3 || date.getMonth() > 9 ? 1 : 2;
      this.day = date.getDay();
      let timeData = {
        student_id: this.uid,
        year: year,
        semester: 1,
      };
      this.$store.dispatch("student/getCourseList", timeData).then(() => {
        // 默认为今天
        this.changeSchedule(this.day);
      });
    },
    changeSchedule(value) {
      // 点击后确认课程有无
      this.currentList = [];
      this.currentList = this.courseList.filter((item) => {
        for (let i = 0; i < item.curriculum.length; i++) {
          if (item.curriculum[i].week == value) {
            this.nowIndex = i;
            return item;
          }
        }
      });
      // console.log(this.currentList);
    },
    jmpRoute(item) {
      this.$router.push({
        path: "/student/course/" + item.course_id,
        query: { title: item.course_name },
      });
    },
  },
};
</script>

<style>
.flexbox {
  display: flex;
  color: #fff;
  justify-content: space-between;
}
</style>
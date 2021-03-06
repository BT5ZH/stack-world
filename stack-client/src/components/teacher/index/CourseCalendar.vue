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
                background: item.titleEn === today.title ? '#13c2c2' : '#409EFF',
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
          <a-button @click="popSelectModal(item)" type="primary">开始上课</a-button>
        </a-col>
      </a-row>
    </a-row>
    <a-row v-else type="flex" justify="center">
      <div class="course-empty">
        <a-empty description="今天暂无课程" />
      </div>
    </a-row>

    <a-modal :zIndex="0" v-model="lessonVisible">
      <div style="padding: 50px 0">
        <a-select
          style="width: 100%"
          v-model="lessonName"
          placeholder="请选择即将授课的课时"
          @change="selectChange"
          allowClear
        >
          <a-select-option
            v-for="(name, index) in lessonNames"
            :value="`${index}:${name}`"
            :key="name"
          >
            {{ name }}
          </a-select-option>
        </a-select>
        <h3 style="color: #666; margin-top: 20px">
          选择课时后，系统将会拉取对应的备课数据
        </h3>
      </div>
      <template #footer>
        <a-button @click="lessonVisible = false">取消</a-button>
        <a-button
          @click="classBegin"
          type="primary"
          :disabled="activityIndex == undefined"
          >开始上课</a-button
        >
      </template>
    </a-modal>
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
    return {
      oneWeek,
      lessonVisible: false,
      lessonName: undefined,
      curCourse: undefined,
      activityIndex: undefined,
    };
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
      courseCalendar: (state) => state.teacher.courseCalendar,
      today: (state) => state.teacher.today,
      orgName: (state) => state.public.orgName,
      subOrgName: (state) => state.public.subOrgName,
      teacherName: (state) => state.public.userName,
      phases: (state) => state.teacher.precourse.nodes,
      realStudents: (state) => {
        // this.dispatch("teacher/getRealStudentsList",state.teacher.curRealStudents)
        state.teacher.curRealStudents;
      },
      // room_id:(state) =>
    }),
    lessonNames() {
      return this.$store.state.teacher.lessonNames;
    },
    ...mapGetters({
      todayCourses: "teacher/todayCourses",
      weekBadages: "teacher/weekBadages",
    }),
  },
  methods: {
    selectChange(value) {
      console.log(value);
      let s_index = value.split(":")[0];
      let s_name = value.split(":")[1];

      this.activityIndex = s_index;
      this.lessonName = s_name;
    },
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
    classBegin() {
      // 1）修改教室状态为using
      const room_id = this.curCourse.room_id;
      const status = "using";
      this.$store.dispatch("teacher/updateRoomStatus", {
        room_id,
        status,
        lessonId: this.curCourse.lessonId,
      });

      // 1-1）设置当前上课的班级
      let selectedDate = this.today.title;
      console.log("今天的日期: " + selectedDate);
      console.log(selectedDate);
      let curclassId = "";
      let curclassName = "";
      this.courseCalendar.forEach((item) => {
        if (this.curCourse.lessonId == item.lessonId) {
          console.log("找到了课表里的课程: " + item.lessonId);
          item.curriculum.forEach((temp) => {
            if (selectedDate == temp.date) {
              console.log("找到了课程的日期: " + temp.date);
              curclassId = temp.class_id._id;
              curclassName = temp.class_id.class_name;
              this.$store.dispatch("teacher/setRealStudent", {
                curRealStudents: temp.class_id.students,
              });
            }
          });
        }
      });
      this.$store.dispatch("teacher/setCurClass", {
        curclassId,
        curclassName,
      });

      // 2）初始化教学活动数据
      let phaseArrData = [];
      // this.phases.forEach((item, index) => {
      //   let objData = {
      //     phase_time: parseInt(item.time.slice(0, 2)),
      //     phase_type: item.tag,
      //     phase_index: index,
      //   };
      //   phaseArrData.push(objData);
      // });

      // const config = { params: { activityID: course.lessonId } };
      const payload = {
        activity_id: this.curCourse.lessonId,
        activity_index: this.activityIndex,
        activity_location: this.curCourse.roomName,
        activity_location_id: this.curCourse.room_id,
        org_name: this.orgName,
        sub_org_name: this.subOrgName,
        teacher_name: this.teacherName,
        phases: phaseArrData,
      };
      axios
        .post("pc/v1/activities", payload)
        .then(({ data }) => {
          // 成功初始化教学活动数据
          // if (!data.data.activityID) {
          //   throw "create room fail";
          // }
          console.log("成功初始化教学活动数据");
          console.log(data.data);
          // 获取当前教学活动ID非课程lessonId
          this.$store.dispatch("teacher/setCurActivityID", {
            curActivityID: data.data._id,
          });
          console.log("成功设置教学活动ID");
          this.$router.push({
            name: "interaction_index",
            query: {
              lessonId: this.curCourse.lessonId,
              name: this.lessonName,
              room_id: this.curCourse.room_id,
            },
          });
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("创建房间失败");
        });
    },
    popSelectModal(course) {
      this.$store
        .dispatch("teacher/getLessonNames", {
          lesson_id: course.lessonId,
          teacher_id: this.uid,
        })
        .then(() => {
          this.curCourse = course;
          this.lessonVisible = true;
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

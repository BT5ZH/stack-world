<template>
  <a-card style="margin-top: .8rem;" :bodyStyle="{padding:'2rem'}">
    <div class="my-row">
      <a :id="i" :key='i' v-for='i in 7' :class="i==day?'my-col col-active':'my-col'" @click='day=i'>{{i}}</a>
    </div>
    <div v-if='currentList.length==0'>
      <p style="text-align: center; margin-top: 1.2rem;">今日暂无课程</p>
    </div>
    <div v-else :key='item.course_id' v-for='item in currentList' @click='jmpRoute(item)' class="schedule_card"
      :style='item.style'>
      <div class="flexbox">
        <h3 style="color: #fff;">{{item.course_name}}</h3>
        <a-tag color="blue" style="height:fit-content;">
          {{item.curriculum[nowIndex].odd}}
        </a-tag>
        <a-tag color="green" style="height:fit-content;">
          {{item.curriculum[nowIndex].time}}
        </a-tag>
        <a-icon type="right-circle" style="font-size: 2rem;margin-top: .5rem;" />
      </div>
      <div class="flexbox">
        <h4 style="color: #fff;">{{item.teacher}}</h4>
        <p>{{item.curriculum[nowIndex].classroom}}</p>
      </div>
    </div>
  </a-card>
</template>

<script>
  import { mapState } from "vuex";
  // import moment from 'moment';

  export default {
    name: 'ScheduleCard',
    data() {
      return {
        nowTime: new Date(),
        day: 1,
        nowIndex:-1,
        currentList: [],
      }
    },
    watch: {
      day: function () {
        this.changeSchedule(this.day);
      },
    },
    methods: {
      getCourse() {
        let date = this.nowTime
        let year = date.getFullYear();
        //  + '-' + Number(date.getFullYear() + 1);
        let semester = date.getMonth() < 8 ? 1 : 2;
        this.day = date.getDay();
        let timeData = { student_id: '2605c370-3dbc-11eb-8646-0f4528100001', year: year, semester: 1 };
        this.$store.dispatch("student/getCourseList", timeData).then(() => {
          this.changeSchedule(this.day);
        });
      },
      changeSchedule(value) {
        this.currentList = []
        this.currentList = this.courseList.filter(item => {
          for(let i = 0;i<item.curriculum.length;i++){
            if (item.curriculum[i].week == value) {this.nowIndex = i; return item;}
          }
        })
        console.log(this.currentList)
      },
      jmpRoute(item) {
        this.$router.push({ path: '/student/course/' + item.course_id, query: { title: item.course_name } });
      }
    },
    mounted(){
      // this.getCourse();
    },
    computed: {
      ...mapState({
        courseList: (state) => state.student.courseList,
        user: (state) => state.student.user,
      })
    }
  }
</script>

<style>
  .flexbox {
    display: flex;
    color: #fff;
    justify-content: space-between;
  }
</style>
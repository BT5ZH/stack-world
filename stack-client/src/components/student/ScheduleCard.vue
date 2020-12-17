<template>
  <a-card style="margin-top: .8rem;" :bodyStyle="{padding:'2rem'}">
    <div class="my-row">
      <a :id="i" :key='i' v-for='i in 7' :class="i==date?'my-col col-active':'my-col'" @click='date=i'>{{i}}</a>
    </div>
    <div v-if='currentList.length==0'>
      <p style="text-align: center; margin-top: 1.2rem;">今日暂无课程</p>
    </div>
    <div :key='item.id' v-for='item in currentList' @click='jmpRoute(item)' class="schedule_card" :style='item.style'>
      <div class="flexbox">
        <h3 style="color: #fff;">{{item.course_name}}</h3>
        <a-tag color="blue" style="height:fit-content;">
          {{item.time}}
        </a-tag>
        <a-icon type="right-circle" style="font-size: 2rem;margin-top: .5rem;" />
      </div>
      <div class="flexbox">
        <h4 style="color: #fff;">{{item.teacher}}</h4>
        <p>{{item.classroom}}</p>
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
        date: 1,
      }
    },
    watch: {
      date: function () {
        this.changeSchedule(this.date);
      },
    },
    methods: {
      changeSchedule(value) {
        this.currentList = this.courseList.filter(item => item.week == value);
      },
      jmpRoute(item) {
        this.$router.push({ path: '/student/course/' + item.course_id, query: { title: item.course_name } });
      }
    },
    created: function () {
      var date = new Date();
      date = date.getDay();
      this.date = date;
      this.changeSchedule(date);
    },
    computed: {
      ...mapState({
        courseList: state => state.student.courseList,
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
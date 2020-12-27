<template>
  <div>
    <a-row class="course_menu">
      <a-col :span="8" :key="index" v-for="(item, index) in courseDetailMenu">
        <button
          :class="
            isClick == index ? 'courseDetailMenu active' : 'courseDetailMenu'
          "
          @click="changeNav(index)"
        >
          {{ item.title }}
        </button>
      </a-col>
    </a-row>
    <div class="course_content" v-if="isClick == 0">
      <a-empty v-if="resList.length == 0" />
      <leftSlider
        v-else
        v-for="item in resList"
        :key="item.id"
        :item="item"
        :isClick="isClick"
        :courseId="courseId"
      >
      </leftSlider>
    </div>
    <div class="course_content" v-if="isClick == 1">
      <gridView4 :gridItems="classMenu" v-if="courseStart"></gridView4>
      <div
        v-else
        style="display: flex; justify-content: center; margin-top: 15rem"
      >
        <a-progress
          type="circle"
          :stroke-color="{
            '0%': '#108ee9',
            '100%': '#87d068',
          }"
          :percent="100"
          :format="() => 'start'"
          style="transform: scale(2)"
        />
      </div>

      <!-- <a-button >开始上课</a-button> -->
    </div>
    <div class="course_content" v-if="isClick == 2">
      <a-empty v-if="homeworkList.length == 0" />
      <resCard
        v-else
        v-for="item in homeworkList"
        :key="item.hid"
        :item="item"
        :isClick="isClick"
        :courseId="courseId"
      >
      </resCard>
    </div>
  </div>
</template>

<script>
import leftSlider from "../../../components/LeftSlider.vue";
import resCard from "../../../components/student/ResCard.vue";
import gridView4 from "../../../layout/GridView4.vue";

import { mapState } from "vuex";
import * as socket from "@/utils/socket";

export default {
  name: "CourseHome",
  components: {
    leftSlider,
    resCard,
    gridView4,
  },
  data() {
    return {
      isClick: 1,
      courseId: null,
      lessonId: "",
    };
  },
  methods: {
    changeNav(value) {
      this.isClick = value;
    },
  },
  created: function () {
    this.courseId = this.$route.params.id;
    console.log(this.courseId);
    this.lessonId = this.$route.query.lessonId;
  },
  mounted() {
    // this.$store.dispatch("student/getResList", this.$route.params.id);
    // this.$store.dispatch("student/getHomeworkList", this.$route.params.id);
    socket.createInstance("student", this, this.lessonId);
  },
  computed: {
    ...mapState({
      courseDetailMenu: (state) => state.student.courseDetailMenu,
      classMenu: (state) => state.student.classMenu,
      resList: (state) => state.student.resList,
      classList: (state) => state.student.classList,
      homeworkList: (state) => state.student.homeworkList,
      openRooms: (state) => state.student.openRooms,
    }),
    courseStart() {
      return this.openRooms.some((item) => item === this.lessonId);
    },
  },
};
</script>

<style lang="scss">
.course_menu {
  margin-bottom: 2rem;
}

.courseDetailMenu {
  width: 100%;
  height: 100%;
  padding: 1.5rem 0;
  text-align: center;
  border: none;
  background-color: #f5f7fa;
  z-index: -1;
}

.courseDetailMenu:active,
.courseDetailMenu:focus {
  outline: none;
}

.active {
  background-color: #fff;
  color: #50b8ee;
}
</style>

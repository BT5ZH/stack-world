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
      <empty v-if="resList.length == 0"></empty>
      <leftSlider
        v-else
        v-for="item in resList"
        :key="item.id"
        :item="item"
        :isClick="isClick"
        :courseId="courseId"
      ></leftSlider>
    </div>
    <div class="course_content" v-if="isClick == 1">
      <gridView4 :gridItems="classMenu"></gridView4>
    </div>
    <div class="course_content" v-if="isClick == 2">
      <a-empty v-if="homeworkList.length == 0" />
      <resCard
        v-else
        v-for="item in homeworkList"
        :key="item.id"
        :item="item"
        :isClick="isClick"
        :courseId="courseId"
      ></resCard>
    </div>
  </div>
</template>

<script>
import leftSlider from "../../../components/LeftSlider.vue";
import resCard from "../../../components/student/ResCard.vue";
import gridView4 from "../../../layout/GridView4.vue";

import { mapState } from "vuex";

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
    };
  },
  mounted() {},
  methods: {
    changeNav(value) {
      this.isClick = value;
      // this.$router.push({ path: '/student/course/' + this.$route.params.id + item.route});
    },
  },
  created: function() {
    this.courseId = this.$route.params.id;
    console.log(this.courseId);
  },
  computed: {
    ...mapState({
      courseDetailMenu: (state) => state.student.courseDetailMenu,
      classMenu: (state) => state.student.classMenu,
      resList: (state) => state.student.resList,
      classList: (state) => state.student.classList,
      homeworkList: (state) => state.student.homeworkList,
    }),
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

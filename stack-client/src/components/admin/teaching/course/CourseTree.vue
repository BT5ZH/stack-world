<template>
  <div>
    <a-empty v-if="!courseProp.length"></a-empty>
    <a-row :gutter="8" v-else>
      <a-col
        v-for="(course, index) in courseProp"
        :key="index"
        :span="6"
        class="card-container"
      >
        <a-card
          class="space"
          :style="{
            backgroundColor: `${courseMap[course.course_type]['color']}`,
          }"
        >
          <a-icon
            :type="courseMap[course.course_type]['icon']"
            class="room_icon"
          />
          <div
            style="display: flex;justify-content: space-between;align-items: flex-start;"
          >
            <a-checkbox @change="onChange($event, course.name)"></a-checkbox>
            <p>{{ course.course_name }}</p>
            <a-tag color="#2db7f5">{{ collegeName[0] }}</a-tag>
            <a-tag color="#ffb900">{{
              courseMap[course.course_type]["name"]
            }}</a-tag>
            <a-icon type="right-circle" style="font-size: 20px;" />
          </div>
          <div>
            <p>课程负责人：{{ course.name }}</p>
            <p>代课老师：{{ course.name }}</p>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  props: ["courseProp", "collegeName"],
  data() {
    return {
      courseMap: {
        专业核心课程: { name: "专业核心课程", color: "#96BFFF", icon: "home" },
        基础课: { name: "基础课", color: "#FFDB5C", icon: "experiment" },
        专业方向课课程: {
          name: "专业方向课课程",
          color: "#9FE6B8",
          icon: "bank",
        },
        专业必修课: { name: "专业必修课", color: "#ff9f7f", icon: "question" },
        其他: { name: "其他", color: "#9FE6B8", icon: "bank" },
      },

      checkedList: [],
      courses: [],
    };
  },
  watch: {
    courses: {
      immediate: true,
      handler(value) {
        // console.log(value);
        this.courses = value;
      },
    },
  },
  methods: {
    onChange(e, value) {
      if (e.target.checked) {
        this.checkedList.push(value);
      } else {
        let index = this.checkedList.findIndex((item) => {
          return item === value;
        });
        //删除元素
        this.checkedList.splice(index, 1);
      }
      // console.log(this.checkedList);
    },
  },
  mounted() {
    this.courses = this.courseProp;
  },
};
</script>

<style scoped>
.my-statistic-title {
  margin-bottom: 10px;
  color: #fff;
  font-size: 20px;
  letter-spacing: 3px;
}

.btn-area {
  padding: 20px 0 20px;
  display: flex;
  justify-content: space-between;
}

.card-container {
  padding-top: 20px;
}

.Card_Info {
  padding-top: 20px;
}

.space {
  border-radius: 6px;
  color: #fff;
  font-weight: 500;
  overflow: hidden;
  font-size: 15px;
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

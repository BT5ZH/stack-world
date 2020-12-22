<template>
  <a-row>
    <a-row class="recent-edit">
      <h2 style="font-weight: bold">最近编辑的课程 &gt;</h2>
    </a-row>
    <a-row :gutter="30">
      <a-col :span="6" v-for="(course, index) in courses" :key="index">
        <a-card style="margin-top: 15px; width: 300px" size="small">
          <img
            slot="cover"
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
          <h3>{{ course.courseName }}</h3>
          <span style="float: left; color: #bbb">{{ course.progress }}</span>
          <span style="float: right; color: #bbb">{{ course.editTime }}</span>
          <template slot="actions" class="ant-card-actions">
            <a-button type="primary" @click="ViewCourseInfo(index)"
              >详情</a-button
            >
            <a-button type="primary">编辑</a-button>
            <a-button type="primary">备课</a-button>
          </template>
        </a-card>
      </a-col>
    </a-row>
  </a-row>
</template>

<script>
export default {
  data() {
    return {
      courses: [
        {
          courseId: "1",
          courseName: "线性代数",
          progress: "9备课/10课次",
          courseCover: "",
          editTime: "2020/10/11",
        },
        {
          courseId: "2",
          courseName: "线性代数",
          progress: "9备课/10课次",
          courseCover: "",
          editTime: "2020/10/11",
        },
        {
          courseId: "3",
          courseName: "线性代数",
          progress: "9备课/10课次",
          courseCover: "",
          editTime: "2020/10/11",
        },
        {
          courseId: "4",
          courseName: "线性代数",
          progress: "9备课/10课次",
          courseCover: "",
          editTime: "2020/10/11",
        },
      ],
    };
  },
  methods: {
    ViewCourseInfo(courseIndex) {
      const courseId = this.courses[courseIndex].courseId;
      this.$router.push({
        name: "teacher_coursedetail",
        query: { courseId },
      });
    },
  },
};
</script>

<style scoped>
.recent-edit {
  margin-top: 20px;
}
</style>
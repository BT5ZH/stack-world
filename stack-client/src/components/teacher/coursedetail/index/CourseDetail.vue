<template>
  <a-row class="container">
    <a-row type="flex" align="middle" class="profile clearfix">
      <a-col :span="4">
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          alt="课程封面"
          class="img-cover"
        />
      </a-col>
      <a-col :span="5">
        <a-row type="flex" justify="space-between" align="top">
          <h2>{{ courseInfo.name }}</h2>
          <span style="line-height: 2.5em">
            课程编码：{{ courseInfo.course_id }}
          </span>
        </a-row>
        <a-row type="flex" justify="space-between" align="top">
          <p>考试类型：{{ courseInfo.evaluation }}</p>
        </a-row>
        <a-row type="flex" justify="space-between" align="top">
          <p>课程属性：{{ courseInfo.course_type }}</p>
        </a-row>
      </a-col>
      <a-col :span="5"> </a-col>
      <a-col :span="6"></a-col>
      <a-col :span="3">
        <a-row style="text-align: center">
          <h3>共 {{ courseInfo.total_study_hours }} 课时</h3>
          <a-button
            type="primary"
            size="large"
            @click="startPrepare(courseInfo)"
            >开始备课</a-button
          >
        </a-row>
      </a-col>
    </a-row>

    <a-row class="content">
      <a-row>
        <a-col :span="3">
          <a-menu style="width: 150px" v-model="curMenus">
            <!-- <a-menu-item key="Knowledge">课程知识点</a-menu-item> -->
            <a-menu-item key="Resource">课程资源</a-menu-item>
            <a-menu-item key="Question">课程试题</a-menu-item>
            <a-menu-item key="Class">课程班级</a-menu-item>
          </a-menu>
        </a-col>
        <a-col :span="21">
          <component :is="curMenus[0]"></component>
        </a-col>
      </a-row>
    </a-row>
  </a-row>
</template>

<script>
import Class from "../class/Class";
import Resource from "../resource/Resource";
import Question from "../question/Question";
import Knowledge from "../knowledge/Knowledge";

export default {
  components: { Resource, Question, Knowledge, Class },
  data() {
    return {
      curMenus: ["Resource"],
      showDescEditor: false,
    };
  },
  computed: {
    courseInfo() {
      return this.$store.state.teacher.courseInfo;
    },
    lessonId() {
      return this.$route.query.lessonId;
    },
  },
  methods: {
    editDesc() {
      this.showDescEditor = !this.showDescEditor;
      // submit modification to back end;
    },
    startPrepare({ name }) {
      const lessonId = this.lessonId;
      this.$router.push({
        name: "teacher_precourse",
        query: { lessonId, lessonName: name },
      });
    },
  },
  mounted() {
    this.$store.dispatch("teacher/getCourseInfo", this.$route.query.lessonId);
  },
};
</script>

<style scoped>
.img-cover {
  cursor: pointer;
  width: 180px;
  height: 120px;
}

.container {
  background: #f0f2f5;
  padding: 15px 20px 0;
}

.profile {
  padding: 10px;
}

.profile,
.content {
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
}

.account {
  margin-right: 30px;
}

.content {
  margin-top: 15px;
  padding: 10px 20px 0;
}
</style>
<template>
  <a-row class="container" :style="{ height: containerHeight }">
    <a-row>
      <a-col :span="5">
        <a-input-search
          placeholder="课程名称"
          enter-button
          @search="onSearch"
        />
      </a-col>
      <a-col :span="16"></a-col>
      <a-col :span="3">
        <a-button type="primary" @click="addVisible = true">新建课程</a-button>
      </a-col>
    </a-row>
    <a-row class="cards-area" :gutter="30">
      <a-col :span="6" v-for="(course, index) in courses" :key="index">
        <a-card style="margin-top: 15px" size="small">
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
    <a-row type="flex" justify="center">
      <a-pagination
        class="pagination"
        :total="50"
        :show-size-changer="true"
        :show-quick-jumper="true"
      ></a-pagination>
    </a-row>

    <a-modal v-model="addVisible" title="添加课程" centered @ok="addCourse">
      <a-form-model
        :model="addForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="formRules"
      >
        <a-form-model-item label="课程名称" prop="courseName">
          <a-input
            v-model="addForm.courseName"
            placeholder="请输入课程名称"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="课时数量"
          prop="courseHours"
          placeholder="请输入课时数量"
        >
          <a-input-number v-model="addForm.courseHours" :min="1" :max="100" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
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
        {
          courseId: "5",
          courseName: "线性代数",
          progress: "9备课/10课次",
          courseCover: "",
          editTime: "2020/10/11",
        },
      ],
      addVisible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      addForm: {
        courseName: "",
        courseHours: 0,
      },
      formRules: {
        courseName: [{ required: true, min: 1, message: "课程名称不能为空！" }],
        courseHours: [{ required: true, message: "课时数量不能为空！" }],
      },
    };
  },
  methods: {
    addCourse() {},
    onSearch() {},
    ViewCourseInfo(courseIndex) {
      const courseId = this.courses[courseIndex].courseId;
      this.$router.push({
        name: "teacher_coursedetail",
        query: { courseId },
      });
    },
  },
  computed: {
    containerHeight() {
      const height = window.innerHeight;
      return `${height - 220}px`;
    },
  },
};
</script>

<style scoped>
.pagination {
  margin-top: 20px;
}
.container {
  height: 100%;
  overflow-y: auto;
}
</style>
<template>
  <a-row class="container" :style="{ 'height': containerHeight }">
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
        <a-button type="primary" @click="addCourse">新建课程</a-button>
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
            <a-button type="primary">详情</a-button>
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
  </a-row>
</template>

<script>
export default {
  data() {
    return {
      courses: [
        {
          courseName: "线性代数",
          progress: "9备课/10课次",
          courseCover: "",
          editTime: "2020/10/11",
        },
        {
          courseName: "线性代数",
          progress: "9备课/10课次",
          courseCover: "",
          editTime: "2020/10/11",
        },
        {
          courseName: "线性代数",
          progress: "9备课/10课次",
          courseCover: "",
          editTime: "2020/10/11",
        },
        {
          courseName: "线性代数",
          progress: "9备课/10课次",
          courseCover: "",
          editTime: "2020/10/11",
        },
        {
          courseName: "线性代数",
          progress: "9备课/10课次",
          courseCover: "",
          editTime: "2020/10/11",
        },
      ],
    };
  },
  methods: {
    addCourse() {},
    onSearch() {},
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
</style>
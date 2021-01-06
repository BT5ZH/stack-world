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
          <h2>{{ courseName }}</h2>
          <span style="line-height: 2.5em">课程编码{{ courseCode }}</span>
        </a-row>
        <a-row type="flex" justify="space-between" align="top">
          <p>课程简介：{{ courseDesc }}</p>
          <a href="#" @click="editDesc">
            {{ showDescEditor ? "保存简介" : "编辑简介" }}
          </a>
        </a-row>
        <a-row type="flex" justify="space-between" align="top">
          <label for="progress">上课进度：</label>
          <a-progress
            :percent="30"
            size="small"
            style="width: 75%"
          ></a-progress>
        </a-row>
      </a-col>
      <a-col :span="6" :push="1">
        <a-input
          v-if="showDescEditor"
          type="textarea"
          :auto-size="{ minRows: 5, maxRows: 5 }"
          v-model="courseDesc"
          placeholder="请输入课程简介！"
        ></a-input>
      </a-col>
      <a-col :span="5"></a-col>
      <a-col :span="3">
        <a-row style="text-align: center">
          <h3>共{{ courseNums }}节课</h3>
          <a-button type="primary" size="large">开始备课</a-button>
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
      courseName: "计算机基础",
      courseCode: "8HB4GC3P0",
      courseNums: 3,
      courseDesc: "暂无简介",
      workNumber: "201501245789",
      curMenus: ["Resource"],
      previewVisible: false,
      showDescEditor: false,
      previewImage: "",
    };
  },
  methods: {
    editDesc() {
      this.showDescEditor = !this.showDescEditor;
      // submit modification to back end;
    },
  },
  created() {},
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
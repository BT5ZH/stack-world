<template>
  <a-row class="container">
    <a-row type="flex" align="middle" class="profile">
      <a-col :span="1" :push="1">
        <div>
          <a-icon type="tags" style="font-size: 40px; color: #5c6bc0" />
        </div>
      </a-col>
      <a-col :span="21" :push="1">
        <h2>{{ teacherName }}</h2>
        <span class="account">账号：{{ uid }}</span>
        <span>工号：{{ workNumber }}</span>
      </a-col>
      <!-- <a-col :span="3">
        <a-button icon="calendar" size="large">我的课表</a-button>
      </a-col> -->
    </a-row>
    <a-row class="content">
      <a-row>
        <a-col :span="3">
          <a-menu style="width: 150px" @click="handleClick" v-model="curMenus">
            <a-menu-item key="Course">课程管理</a-menu-item>
            <a-menu-item key="Feedback">课堂反馈</a-menu-item>
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
import Feedback from "./Feedback";
import Course from "./Course";
import { mapState } from "vuex";

export default {
  components: { Feedback, Course },
  data() {
    return {
      curMenus: ["Course"],
    };
  },
  computed: {
    ...mapState({
      workNumber: (state) => state.public.user_id,
      teacherName: (state) => state.public.name,
      uid: (state) => state.public.email,
    }),
  },
  methods: {
    handleClick() {},
  },
  created() {},
};
</script>

<style scoped>
.container {
  background: #f0f2f5;
  padding: 15px 20px 0;
}

.profile {
  padding: 20px;
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
<template>
  <a-row>
    <a-row type="flex" justify="center" align="middle" class="profile">
      <a-col :span="1">
        <a-icon type="tags" style="font-size: 40px; color: #5c6bc0" />
      </a-col>
      <a-col :span="15">
        <h2>{{ teacherName }}</h2>
        <span class="account">账号：{{ uid }}</span>
        <span>工号：{{ workNumber }}</span>
      </a-col>
      <a-col :span="7">
        <a-button icon="calendar" size="large">我的课表</a-button>
      </a-col>
    </a-row>
    <a-row class="content">
        
    </a-row>
  </a-row>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      teacherName: "李师",
      uid: "201501245789",
      workNumber: "201501245789",
    };
  },
};
</script>

<style scoped>
.profile,
.content {
  background: #f8f8f8;
  padding: 20px 0;
}

.account {
  margin-right: 30px;
}

.content {
  margin-top: 10px;
}
</style>
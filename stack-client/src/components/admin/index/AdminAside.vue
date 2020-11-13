<template>
  <a-menu mode="inline" theme="dark" @click="route_to">
    <a-sub-menu key="teaching">
      <template #title>
        <span><a-icon type="mail" /><span>教学信息管理</span></span>
      </template>
      <a-menu-item key="admin_semester">
        <a-icon type="deployment-unit" />
        <span>学年学期</span>
      </a-menu-item>
      <a-menu-item key="admin_timetable">
        <a-icon type="deployment-unit" />
        <span>上课时间表</span>
      </a-menu-item>
      <a-menu-item key="admin_space">
        <a-icon type="deployment-unit" />
        <span>教学空间</span>
      </a-menu-item>
      <a-menu-item key="admin_institution">
        <a-icon type="deployment-unit" />
        <span>院系班级</span>
      </a-menu-item>
      <a-menu-item key="admin_teacher">
        <a-icon type="deployment-unit" />
        <span>教师管理</span>
      </a-menu-item>
      <a-menu-item key="admin_course">
        <a-icon type="deployment-unit" />
        <span>课程管理</span>
      </a-menu-item>
      <a-menu-item key="admin_schedule">
        <a-icon type="deployment-unit" />
        <span>课表设置</span>
      </a-menu-item>
    </a-sub-menu>
    <a-menu-item key="admin_resource">
      <a-icon type="usergroup-add" />
      <span>资源管理</span>
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  methods: {
    route_to({ key }) {
      if (this.$route.name !== key) {
        this.$router.push({ name: key });
      }
    },
  },
};
</script>

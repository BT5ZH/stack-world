<template>
  <a-row>
    <a-col :span="3">
      <h2>教学小栈</h2>
    </a-col>
    <a-col :span="15">
      <ul class="menu" @click="tabChange">
        <li
          v-for="menu in menus"
          :key="menu.id"
          :class="{ 'menu-active': currentMenu === menu.id }"
          :id="menu.id"
        >
          {{ menu.name }}
        </li>
      </ul>
    </a-col>
    <a-col :span="6">
      <span>{{ teacher_name }}（教师）</span>
    </a-col>
  </a-row>
</template>

<script>
export default {
  data() {
    return {
      currentMenu: "teacher_index",
      teacher_name: "李师",
      menus: [
        { name: "首页", id: "teacher_index" },
        { name: "课程中心", id: "teacher_course" },
        { name: "资源中心", id: "teacher_resource" },
        { name: "教学分析", id: "teacher_analysis" },
        { name: "金课工具", id: "teacher_tools" },
      ],
    };
  },
  methods: {
    tabChange({ target }) {
      const key = target.id;
      if (this.$route.name !== key) {
        this.currentMenu = key;
        this.$router.push({ name: key });
      }
    },
  },
};
</script>

<style>
.menu {
  list-style: none;
}
.menu li {
  display: inline;
  margin-right: 10%;
  cursor: pointer;
}
.menu li:hover,
.menu-active {
  color: #409eff;
}
</style>
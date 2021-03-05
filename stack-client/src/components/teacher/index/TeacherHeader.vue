<template>
  <a-row>
    <a-col :span="3">
      <h2>教学小栈</h2>
    </a-col>
    <a-col :span="15">
      <ul class="menu">
        <li
          v-for="menu in menus"
          :key="menu.id"
          :class="{ 'menu-active': currentMenu === menu.id }"
          :id="menu.id"
          @click="tabChange(menu)"
        >
          {{ menu.name }}
        </li>
      </ul>
    </a-col>
    <a-col :span="6">
      <a-dropdown>
        <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
          {{ teacher_name }}（教师）<a-icon type="down" />
        </a>
        <a-menu slot="overlay">
          <!-- <a-menu-item>
            <a href="javascript:;">修改密码</a>
          </a-menu-item> -->
          <a-menu-item>
            <a href="javascript:;" @click="quitLogin">退出登录</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-col>
  </a-row>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      currentMenu: "teacher_index",
      menus: [
        { name: "首页", id: "teacher_index" },
        //{ name: "课程中心", id: "teacher_course" },
        // { name: "资源中心", id: "teacher_resource" },
        // { name: "教学分析", id: "teacher_analysis" },
        // { name: "金课工具", id: "teacher_tools" },
      ],
    };
  },
  computed: {
    ...mapState({
      teacher_name: (state) => state.public.userName,
    }),
  },
  methods: {
    tabChange(target) {
      const key = target.id;
      if (this.$route.name !== key) {
        this.currentMenu = key;
        this.$router.push({ name: key });
      }
    },
    quitLogin() {
      this.$store.commit("public/clearStorage");
      this.$store.commit("super/clearStorage");
      this.$store.commit("teacher/clearStorage");
      localStorage.clear();
      sessionStorage.clear();
      this.$router.push({ name: "index" });
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

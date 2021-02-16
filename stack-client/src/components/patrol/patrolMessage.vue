<template>
  <div>
    <!-- 下拉菜单 -->
    <a-dropdown>
      <a-button block> {{ orgName }} <a-icon type="down" /> </a-button>
      <a-menu slot="overlay">
        <a-sub-menu
          v-for="SubOrg in treeData"
          :key="SubOrg.showName"
          :title="SubOrg.showName"
        >
          <a-menu-item
            v-for="major in SubOrg.childMenu"
            :key="major.showName"
            @click="menuSelect({ subOrg: SubOrg.showName, major: major.showName })"
            >{{ major.showName }}</a-menu-item
          >
        </a-sub-menu>
      </a-menu>
    </a-dropdown>
    <!-- 直播房间列表 -->
    <ul class="liveList">
      <li style="color: #6d757a">
        <span>课程名</span>
        <span>教师名</span>
        <span>班级名</span>
        <span>教室名</span>
        <span></span>
      </li>
      <li v-for="item in liveRooms" :key="item.lesson_id">
        <a-popover>
          <template slot="content">
            <p>{{ item.course.name }}</p>
          </template>
          <span>{{ item.course.name }}</span>
        </a-popover>
        <a-popover>
          <template slot="content">
            <p>{{ item.teacher.name }}</p>
          </template>
          <span>{{ item.teacher.name }}</span>
        </a-popover>
        <a-popover>
          <template slot="content">
            <p>{{ item.class.class_name }}</p>
          </template>
          <span>{{ item.class.class_name }}</span>
        </a-popover>
        <a-popover>
          <template slot="content">
            <p>{{ item.room.room_number }}</p>
          </template>
          <span>{{ item.room.room_number }}</span>
        </a-popover>
        <a @click="goLook(item.lesson_id)">巡课</a>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from "vuex";
import axiosInstance from "@/utils/axios";

export default {
  data() {
    return {
      menuData: {},
    };
  },
  mounted() {
    this.$store.dispatch("patrol/getPatrolMessage", this.orgName);
  },
  methods: {
    menuSelect(params) {
      this.menuData = params;
    },
    goLook(lessonID) {
      this.$router.push({
        path: "/patrol/detail",
        query: { lessonId: lessonID },
      });
    },
  },
  computed: {
    liveRooms() {
      if (!this.menuData.subOrg) return this.patrolMessage;
      else
        return this.patrolMessage.filter((item) => {
          return item.subOrg == this.menuData.subOrg && item.major == this.menuData.major;
        });
    },
    ...mapState({
      orgName: (state) => state.public.orgName,
      patrolMessage: (state) => state.patrol.patrolMessage,
      treeData: (state) => state.patrol.patrolTree,
    }),
  },
};
</script>
<style>
.quit {
  position: absolute;
  right: 0;
  top: 20px;
}
.liveList {
  list-style: none;
  padding: 10px;
}
.liveList > li {
  padding: 10px;
  display: flex;
  justify-content: space-around;
}
.liveList > li > span {
  width: 3em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

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
            @click="menuSelect"
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
      <li v-for="item in liveRooms" :key="item.lessonID">
        <a-popover>
          <template slot="content">
            <p>{{ item.lessonName }}</p>
          </template>
          <span>{{ item.lessonName }}</span>
        </a-popover>
        <a-popover>
          <template slot="content">
            <p>{{ item.teacherName }}</p>
          </template>
          <span>{{ item.teacherName }}</span>
        </a-popover>
        <a-popover>
          <template slot="content">
            <p>{{ item.className }}</p>
          </template>
          <span>{{ item.className }}</span>
        </a-popover>
        <a-popover>
          <template slot="content">
            <p>{{ item.roomName }}</p>
          </template>
          <span>{{ item.roomName }}</span>
        </a-popover>
        <a @click="goLook(item.lessonID)">巡课</a>
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
      treeData: [
        {
          showName: "计算机科学学院",
          childMenu: [
            { showName: "软件工程" },
            { showName: "人工智能" },
            { showName: "网络安全" },
          ],
        },
      ],
      liveRooms: [
        {
          lessonID: "001",
          lessonName: "软件工程导论",
          teacherName: "张莉",
          className: "软工1901",
          roomName: "文津楼1201",
        },
        {
          lessonID: "002",
          lessonName: "计算机组成原理",
          teacherName: "李莉",
          className: "软工1901",
          roomName: "文津楼1305",
        },
      ],
    };
  },
  mounted() {},
  methods: {
    async getTreeData() {
      let queryString = this.orgName;
      const url = "/pc/v1/classes/classTree?org_name=" + queryString;
      try {
        const { data } = await axiosInstance.get(url);
        this.treeData = data.data;
        console.log("this.treeData");
        console.log(this.treeData);
      } catch (err) {
        console.log(err);
      }
    },
    menuSelect(e) {
      console.log("click" + e);
    },
    goLook(lessonID) {
      this.$router.push({
        path: "/patrol/detail",
        query: { lessonId: lessonID },
      });
    },
  },
  computed: {
    ...mapState({
      orgName: (state) => state.public.orgName,
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

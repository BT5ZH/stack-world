<template>
  <div>
    <!-- 下拉菜单 -->
    <a-dropdown>
      <a-button block> {{ orgName }} <a-icon type="down" /> </a-button>
      <a-menu slot="overlay">
        <a-sub-menu
          style="width=800px;"
          v-for="SubOrg in treeData"
          :key="SubOrg.subOrgName"
          :title="SubOrg.subOrgName"
        >
          <a-menu-item
            v-for="major in SubOrg.majors"
            :key="major.majorName"
            @click="menuSelect({ subOrg: SubOrg.subOrgName, major: major.majorName })"
            >{{ major.majorName }}</a-menu-item
          >
        </a-sub-menu>
      </a-menu>
    </a-dropdown>
    <br /><br />
    <!-- 直播房间列表 -->
    <a-table
      rowKey="timeTable_id"
      :pagination="{
        total: liveRooms.length,
        pageSizeOptions: pageSize,
        'show-less-items': true,
        'show-size-changer': true,
        'show-quick-jumper': true,
        'hide-on-single-page': true,
      }"
      :bordered="true"
      :columns="columns"
      :data-source="liveRooms"
    >
      <template #operation="record">
        <a-button type="link" @click="goLook(record.lesson_id)">巡课</a-button>
      </template>
    </a-table>
  </div>
</template>
<script>
import { mapState } from "vuex";
import axiosInstance from "@/utils/axios";

export default {
  data() {
    return {
      menuData: {},
      pageSize: ["10", "20", "30", "50", "100"],
      columns: [
        {
          title: "学院",
          dataIndex: "subOrg",
          align: "center",
        },
        {
          title: "专业",
          dataIndex: "major",
          align: "center",
        },
        {
          title: "课程名",
          dataIndex: "course.name",
          align: "center",
        },
        {
          title: "班级名",
          dataIndex: "class.class_name",
          align: "center",
        },
        {
          title: "教师名",
          dataIndex: "teacher.name",
          align: "center",
        },
        {
          title: "教室名",
          dataIndex: "room.room_number",
          align: "center",
        },
        {
          title: "操作",
          align: "center",
          scopedSlots: { customRender: "operation" },
        },
      ],
    };
  },
  mounted() {
    // 获取查询树
    this.$store.dispatch("patrol/getPatrolTree", this.oid);
    // 获取所有巡课信息
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
      oid: (state) => state.public.oid,
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
</style>

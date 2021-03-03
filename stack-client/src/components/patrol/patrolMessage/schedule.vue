<template>
  <table border="1" width="100%" align="center" class="table">
    <thead>
      <tr height="50px">
        <td
          width="12%"
          align="center"
          v-for="headData in columns"
          :key="headData.dataIndex"
        >
          {{ headData.title }}
        </td>
      </tr>
    </thead>
    <tbody>
      <tr
        align="center"
        height="80px"
        v-for="(element, index) in scheduleData"
        :key="index"
      >
        <td>{{ element.scheduleTitle }}</td>
        <td @click="goInfo(element.monday)">
          {{ element.monday ? element.monday.length : 0 }}
        </td>
        <td @click="goInfo(element.tuesday)">
          {{ element.tuesday ? element.tuesday.length : 0 }}
        </td>
        <td @click="goInfo(element.wednesday)">
          {{ element.wednesday ? element.wednesday.length : 0 }}
        </td>
        <td @click="goInfo(element.thursday)">
          {{ element.thursday ? element.thursday.length : 0 }}
        </td>
        <td @click="goInfo(element.friday)">
          {{ element.friday ? element.friday.length : 0 }}
        </td>
        <td @click="goInfo(element.saturday)">
          {{ element.saturday ? element.saturday.length : 0 }}
        </td>
        <td @click="goInfo(element.sunday)">
          {{ element.sunday ? element.sunday.length : 0 }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { mapState } from "vuex";
import axiosInstance from "@/utils/axios";

export default {
  data() {
    return {
      scheduleData: [
        {
          scheduleTitle: "第1节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第2节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第3节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第4节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第5节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第6节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第7节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第8节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第9节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第10节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
      ],
      columns: [
        {
          title: " ",
          dataIndex: "scheduleTitle",
          align: "center",
          width: "9%",
        },
        {
          title: "星期一",
          dataIndex: "monday.length",
          align: "center",
        },
        {
          title: "星期二",
          dataIndex: "tuesday.length",
          align: "center",
        },
        {
          title: "星期三",
          dataIndex: "wednesday.length",
          align: "center",
        },
        {
          title: "星期四",
          dataIndex: "thursday.length",
          align: "center",
        },
        {
          title: "星期五",
          dataIndex: "friday.length",
          align: "center",
        },
        {
          title: "星期六",
          dataIndex: "saturday.length",
          align: "center",
        },
        {
          title: "星期日",
          dataIndex: "sunday.length",
          align: "center",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      patrolscheduleData: (state) => state.patrol.patrolSchedule,
      menuSelectsSubOrg: (state) => state.patrol.menuSelect.subOrg,
      orgName: (state) => state.public.orgName,
    }),
  },
  mounted() {
    this.loadScheduleData();
  },
  watch: {
    async menuSelectsSubOrg(val) {
      await this.$store.dispatch("patrol/getPatrolMessage", this.orgName);
      this.loadScheduleData();
      // 强制渲染
      this.$forceUpdate();
    },
  },
  methods: {
    // 加载课程计划的数据
    loadScheduleData() {
      // 初始化课表
      this.initScheduleData();
      // 重新加载课表
      this.patrolscheduleData.forEach((item, order) => {
        this.scheduleData[order].monday = item[0];
        this.scheduleData[order].tuesday = item[1];
        this.scheduleData[order].wednesday = item[2];
        this.scheduleData[order].thursday = item[3];
        this.scheduleData[order].friday = item[4];
        this.scheduleData[order].saturday = item[5];
        this.scheduleData[order].sunday = item[6];
      });
      console.log(
        "🚀 ~ file: schedule.vue ~ line 231 ~ loadScheduleData ~ this.scheduleData",
        this.scheduleData
      );
    },
    goInfo(element) {
      this.$emit("goInfo", element, "patrolTable");
    },
    initScheduleData() {
      this.scheduleData = [
        {
          scheduleTitle: "第1节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第2节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第3节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第4节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第5节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第6节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第7节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第8节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第9节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        {
          scheduleTitle: "第10节",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
      ];
    },
  },
};
</script>
<style></style>

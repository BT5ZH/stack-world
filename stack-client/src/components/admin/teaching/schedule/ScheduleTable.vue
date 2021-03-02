<template>
  <div>
    <a-row>
      <h2 style="text-align: center">{{ tableTitle }}</h2>
      <h3 style="text-align: center">{{ tableSemester }}</h3>
    </a-row>
    <a-row>
      <a-spin :spinning="spin_status" tip="Loading...">
        <a-table
          :columns="columns"
          :data-source="scheduleData"
          :pagination="false"
          bordered
          rowKey="scheduleTitle"
        >
        </a-table>
      </a-spin>
    </a-row>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    courseTableData: {
      type: Array,
    },
  },
  computed: {
    ...mapState({
      Tree_spin_status: (state) => state.admin.Tree_spin_status,
      spin_status: (state) => state.admin.spin_status,
    }),
  },
  //
  watch: {
    courseTableData(val) {
      try {
        // console.log("---val---");
        // console.log(val);
        // 标题
        let nextyear = Number(val[0].match.year) + 1;
        this.tableTitle = val[0].show.building_name + "-" + val[0].show.room_name;
        this.tableSemester =
          val[0].match.year + "-" + nextyear + "第" + val[0].match.semester + "学期";

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
        val.map((item) => {
          for (let i = 0; i <= item.match.order.length; i++) {
            let courseTime = Number(item.match.order.pop()) - 1;
            if (item.match.date === "Mon") {
              this.scheduleData[courseTime].monday =
                item.show.course_name + "(" + item.show.week + ")";
            } else if (item.match.date === "Tue") {
              this.scheduleData[courseTime].tuesday =
                item.show.course_name + "(" + item.show.week + ")";
            } else if (item.match.date === "Wed") {
              this.scheduleData[courseTime].wednesday =
                item.show.course_name + "(" + item.show.week + ")";
            } else if (item.match.date === "Thu") {
              this.scheduleData[courseTime].thursday =
                item.show.course_name + "(" + item.show.week + ")";
            } else if (item.match.date === "Fri") {
              this.scheduleData[courseTime].friday =
                item.show.course_name + "(" + item.show.week + ")";
            } else if (item.match.date === "Sat") {
              this.scheduleData[courseTime].saturday =
                item.show.course_name + "(" + item.show.week + ")";
            } else {
              this.scheduleData[courseTime].sunday =
                item.show.course_name + "(" + item.show.week + ")";
            }
            // console.log(courseTime)
          }
          // item.match.order.pop()
          // console.log(item.match.order);
        });
      } catch (err) {
        // console.log(err);
        this.$message.error("没有排课");
        this.tableTitle = "";
        this.tableSemester = "";
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
      }
    },
  },
  data() {
    return {
      // 显示标题
      tableTitle: "",
      tableSemester: "2020-2021第一学期",
      columns: [
        {
          title: " ",
          dataIndex: "scheduleTitle",
          align: "center",
          width: "9%",
        },
        {
          title: "星期一",
          dataIndex: "monday",
          align: "center",
        },
        {
          title: "星期二",
          dataIndex: "tuesday",
          align: "center",
        },
        {
          title: "星期三",
          dataIndex: "wednesday",
          align: "center",
        },
        {
          title: "星期四",
          dataIndex: "thursday",
          align: "center",
        },
        {
          title: "星期五",
          dataIndex: "friday",
          align: "center",
        },
        {
          title: "星期六",
          dataIndex: "saturday",
          align: "center",
        },
        {
          title: "星期日",
          dataIndex: "sunday",
          align: "center",
        },
      ],
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
    };
  },
  methods: {},
};
</script>

<style scoped>
.btn-area {
  padding-bottom: 10px;
}
</style>

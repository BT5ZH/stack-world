<template>
  <div>
    <div class="menu-header">
      <a-menu mode="horizontal" @select="handleClick">
        <a-menu-item key="preview">预习成绩和详情</a-menu-item>
        <a-menu-item key="activity">课堂活动成绩和详情</a-menu-item>
        <a-menu-item key="homework">课后作业成绩和详情</a-menu-item>
      </a-menu>
    </div>
    <div class="other">
      <a-row>
        <a-col :span="16">
          <a-range-picker
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :placeholder="['开始时间', '结束时间']"
            @change="onChange"
            @ok="onOk"
          />
          <a-select default-value="请选择" style="margin-left:10px" @change="handleChange">
            <a-select-option value="教师姓名">教师姓名</a-select-option>
            <a-select-option value="课程名称">课程名称</a-select-option>
          </a-select>
          <a-input
            style="width: 200px"
            :placeholder="showTag"
            v-model="chooseValue"
            @keyup.enter="enterData"
          />
          <a-button style="width: 10%; margin-left:10px;" @click="check">查询</a-button>
        </a-col>
        <a-col :span="8" :push="5">
          <a-button type="primary" @click="exportData">导出当前数据</a-button>
        </a-col>
      </a-row>
      <a-table
        :columns="columns"
        :data-source="dataList"
        bordered
        style="margin-top:10px"
        rowKey="id"
      >
        <template slot="operation" slot-scope="text, record">
          <a-button type="link" @click="showDetails(record.key)">详情</a-button>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
const columns = [
  {
    title: "序号",
    align: "center",
    dataIndex: "id",
  },
  {
    title: "开启活动时间",
    align: "center",
    dataIndex: "begin",
  },
  {
    title: "活动名称",
    align: "center",
    dataIndex: "activity",
  },
  {
    title: "成绩",
    align: "center",
    dataIndex: "grades",
  },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "operation" },
  },
];

const dataList = [
  {
    id: "1",
    begin: "2020-09-06 15:12",
    activity: "课堂互动",
    grades: "/",
  },
  {
    id: "2",
    begin: "2020-09-04 15:12",
    activity: "随机抽取",
    grades: "79分",
  },
];

export default {
  data() {
    return {
      current: ["activity"],
      columns,
      dataList,
      selectValue: "",
      chooseValue: "",
      checkInfo: {
        startTime: "",
        endTime: "",
        courseName: "",
        teacher: "",
      },
    };
  },
  methods: {
    handleClick(e) {
      console.log(e.key);
    },
    onChange(value, dateString) {
      // console.log("Selected Time: ", value);
      // console.log("Formatted Selected Time: ", dateString);
      this.checkInfo.startTime = dateString[0];
      this.checkInfo.endTime = dateString[1];
    },
    onOk(value) {
      console.log("onOk: ", value);
    },
    handleChange(value) {
      console.log(value);
      this.selectValue = value;
      this.chooseValue = "";
    },
    enterData() {
      // console.log("点击回车")
      if (this.selectValue === "教师姓名") {
        this.checkInfo.teacher = this.chooseValue;
      } else if (this.selectValue === "课程名称") {
        this.checkInfo.courseName = this.chooseValue;
      }
    },

    check() {
      console.log("查询数据");
      console.log(this.checkInfo);
    },
    exportData() {
      console.log("导出数据");
    },
    showDetails(key) {
      console.log("输出详情");
      console.log(key);
    },
  },
  computed: {
    showTag() {
      switch (this.selectValue) {
        case "教师姓名":
          return "请输入教师姓名";
          break;
        case "课程名称":
          return "请输入课程名称";
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style>
.menu-header {
  margin: 10px;
}
.other {
  margin: 10px;
}
</style>
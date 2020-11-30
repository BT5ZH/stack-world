<template>
  <div>
    <div class="menu-header">
      <a-menu mode="horizontal" @select="handleClick">
        <a-menu-item key="log">设备日志</a-menu-item>
        <a-menu-item key="activity">课程活动</a-menu-item>
        <a-menu-item key="resource">资源使用数据</a-menu-item>
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
    title: "上课时间",
    align: "center",
    dataIndex: "begin",
  },
  {
    title: "课程名称",
    align: "center",
    dataIndex: "course",
  },
  {
    title: "教师姓名",
    align: "center",
    dataIndex: "teacher",
  },
  {
    title: "位置",
    align: "center",
    dataIndex: "position",
  },
  {
    title: "上课时长",
    align: "center",
    dataIndex: "duration",
  },
  {
    title: "完成预习人数",
    align: "center",
    dataIndex: "preview",
  },
  {
    title: "出勤率",
    align: "center",
    dataIndex: "attention",
  },
  {
    title: "完成课后复习人数",
    align: "center",
    dataIndex: "review",
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
    course: "高等数学",
    teacher: "李华",
    position: "主楼-3层-0315",
    duration: "45 min",
    preview: 15 / 16,
    attention: 15 / 16,
    review: 15 / 16,
  },
  {
    id: "2",
    begin: "2020-09-04 15:12",
    course: "大学英语",
    teacher: "王琪",
    position: "二教-1层-0111",
    duration: "128 min",
    preview: 75 / 102,
    attention: 102 / 102,
    review: 189 / 102,
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
      console.log(e);
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
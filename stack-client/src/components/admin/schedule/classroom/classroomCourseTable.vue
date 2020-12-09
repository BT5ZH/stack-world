<template>
  <div>
    <a-select
      label-in-value
      :default-value="{ key: '1' }"
      style="width: 200px"
      @change="handleChange"
    >
      <a-select-option value="1">2020-2021年第一学期</a-select-option>
      <a-select-option value="2">2021-2022年第二学期</a-select-option>
    </a-select>
    <div class="table">
      <h2 style="text-align: center">图书馆-1-1001</h2>
      <a-table
        :columns="columns"
        :data-source="dataList"
        bordered
        rowKey="scheduleTitle"
        :pagination="false"
      >
        <template #monday="text">
          <p>{{ text.split(" ")[0] }}</p>
          <p>{{ text.split(" ")[1] }}</p>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: " ",
    dataIndex: "scheduleTitle",
    align: "center",
    width: "12%",
  },
  {
    title: "星期一",
    dataIndex: "monday",
    align: "center",
    width: "12%",
    scopedSlots: { customRender: "monday" },
  },
  {
    title: "星期二",
    dataIndex: "tuesday",
    align: "center",
    width: "12%",
  },
  {
    title: "星期三",
    dataIndex: "wednesday",
    align: "center",
    width: "12%",
  },
  {
    title: "星期四",
    dataIndex: "thursday",
    align: "center",
    width: "12%",
  },
  {
    title: "星期五",
    dataIndex: "friday",
    align: "center",
    width: "12%",
  },
  {
    title: "星期六",
    dataIndex: "saturday",
    align: "center",
    width: "12%",
  },
  {
    title: "星期日",
    dataIndex: "sunday",
    align: "center",
    width: "12%",
  },
];

const dataList = [
  {
    scheduleTitle: "第1-2节",
    monday:
      "*计算机体系结构，2-14周，李国栋，图书馆-1-101 *军事理论，第7,14周，王维，图书馆-1-101",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  },
  {
    scheduleTitle: "第3-4节",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  },
  {
    scheduleTitle: "第5-6节",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  },
  {
    scheduleTitle: "第7-8节",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  },
];
export default {
  data() {
    return {
      columns,
      dataList,
    };
  },
  methods: {
    handleChange(value) {
      console.log(value); // { key: "1", label: "2020-2021年第一学期" }
    },
  },
};
</script>

<style>
.table {
  margin-top: 10px;
}
</style>
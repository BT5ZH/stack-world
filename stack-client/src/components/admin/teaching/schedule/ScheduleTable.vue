<template>
  <div>
    <a-row class="btn-area">
      <a-col :span="5">
        <a-select @change="onSelect" style="width: 100%">
          <a-select-option
            :value="index"
            v-for="(sem, index) in semesters"
            :key="index"
          >
            {{ sem.name }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row>
      <h2 style="text-align: center">{{ "图书馆-1-1001" }}</h2>
    </a-row>
    <a-row>
      <a-table
        :columns="columns"
        :data-source="scheduleData"
        :pagination="false"
        bordered
        rowKey="scheduleTitle"
      >
      </a-table>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      semesters: [
        { name: "2020-2021第一学期" },
        { name: "2020-2021第二学期" },
        { name: "2021-2022第一学期" },
      ],
      columns: [
        {
          title: " ",
          dataIndex: "scheduleTitle",
          align: "center",
          width: "9%"
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
          scheduleTitle: "第1-2节",
          monday: "",
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
        {
          scheduleTitle: "第9-10节",
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
  methods: {
    onSelect() {},
  },
};
</script>

<style scoped>
.btn-area {
  padding-bottom: 10px;
}
</style>
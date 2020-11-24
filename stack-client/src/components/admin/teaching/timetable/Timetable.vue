<template>
  <a-row class="container">
    <a-col :span="18" :push="3">
      <h2 style="text-align: center">上课时间表</h2>
      <a-table
        :columns="columns"
        :data-source="data"
        bordered
        rowKey="index"
        :pagination="false"
      >
        <template #summerOperation="record">
          <a-button type="link" @click="editSummerTime(record)">编辑</a-button>
        </template>
        <template #winterOperation="record">
          <a-button type="link" @click="editWinterTime(record)">编辑</a-button>
        </template>
      </a-table>
    </a-col>
  </a-row>
</template>

<script>
export default {
  data() {
    const columns = [
      { title: "课次名称", dataIndex: "sessionName", align: "center" },
      {
        title: "夏令时",
        align: "center",
        children: [
          {
            title: "上课时间",
            align: "center",
            dataIndex: "summerSchoolTime",
          },
          {
            title: "下课时间",
            align: "center",
            dataIndex: "summerBreakTime",
          },
          {
            title: "操作",
            align: "center",
            scopedSlots: { customRender: "summerOperation" },
          },
        ],
      },
      {
        title: "冬令时",
        align: "center",
        children: [
          {
            title: "上课时间",
            align: "center",
            dataIndex: "winterSchoolTime",
          },
          {
            title: "下课时间",
            align: "center",
            dataIndex: "winterBreakTime",
          },
          {
            title: "操作",
            align: "center",
            scopedSlots: { customRender: "winterOperation" },
          },
        ],
      },
    ];
    const data = [
      {
        index: "0",
        sessionName: "第1、2节课",
        summerSchoolTime: "08:30",
        summerBreakTime: "09:30",
        winterSchoolTime: "08:00",
        winterBreakTime: "09:00",
      },
      {
        index: "1",
        sessionName: "第3、4节课",
        summerSchoolTime: "08:30",
        summerBreakTime: "09:30",
        winterSchoolTime: "08:00",
        winterBreakTime: "09:00",
      },
      {
        index: "2",
        sessionName: "第5、6节课",
        summerSchoolTime: "08:30",
        summerBreakTime: "09:30",
        winterSchoolTime: "08:00",
        winterBreakTime: "09:00",
      },
      {
        index: "3",
        sessionName: "第7、8节课",
        summerSchoolTime: "08:30",
        summerBreakTime: "09:30",
        winterSchoolTime: "08:00",
        winterBreakTime: "09:00",
      },
      {
        index: "4",
        sessionName: "第9、10节课",
        summerSchoolTime: "08:30",
        summerBreakTime: "09:30",
        winterSchoolTime: "08:00",
        winterBreakTime: "09:00",
      },
    ];
    return {
      columns,
      data,
    };
  },
  methods: {
    editSummerTime(record) {
      console.log(record);
    },
    editWinterTime(record) {
      console.log(record);
    },
  },
};
</script>

<style scoped>
.container {
  padding: 10px;
  height: 100%;
}
</style>
<template>
  <a-row class="container">
    <a-row>
      <a-table
        rowKey="lesson_id"
        :columns="columns"
        :data-source="lessonList"
        bordered
        :pagination="{
          total: lessonList.length,
          'show-size-changer': true,
          'show-quick-jumper': true,
        }"
      >
        <template #classes="classList">
          <div v-for="(item, index) in classList" :key="index">
            <span>{{ item.class_name }}</span>
            <br />
          </div>
        </template>
        <template #operation="record">
          <a @click="relieve(record)" v-on:click="$emit('refresh')">解除关联</a>
        </template>
        <template #location="record">
          <a @click="openLocationSelect(record)">地点</a>
        </template>
        <template #day="record">
          <a @click="openDaySelect(record)">周几</a>
        </template>
        <template #order="record">
          <a @click="openOrderSelect(record)">时间</a>
        </template>
      </a-table>
    </a-row>
  </a-row>
</template>

<script>
import axios from "@/utils/axios";

const columns = [
  {
    title: "课程编号",
    dataIndex: "course_id",
    align: "center",
  },
  {
    title: "课程",
    dataIndex: "course_name",
    align: "center",
  },
  {
    title: "教师",
    dataIndex: "teacher_name",
    align: "center",
  },
  {
    title: "班级",
    dataIndex: "classes",
    scopedSlots: { customRender: "classes" },
    align: "center",
  },
  {
    title: "学年",
    dataIndex: "year",
    align: "center",
  },
  {
    title: "学期",
    dataIndex: "semester",
    align: "center",
  },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "operation" },
  },
  {
    title: "地点",
    align: "center",
    scopedSlots: { customRender: "location" },
  },
  {
    title: "日期",
    align: "center",
    scopedSlots: { customRender: "day" },
  },
  {
    title: "节次",
    align: "center",
    scopedSlots: { customRender: "order" },
  },
];
export default {
  props: {
    lessonList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      columns,
    };
  },
  mounted() {},
  methods: {
    relieve({ lesson_id }) {
      const url = `/pc/v1/lessons/${lesson_id}`;
      axios
        .delete(url)
        .then(({ data }) => {
          console.log(data);
          const { status } = data;
          if (status) throw "relieve course success";
          this.$message.success("解除关联成功");
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("解除关联失败！");
        });
    },
  },
};
</script>

<style scoped></style>

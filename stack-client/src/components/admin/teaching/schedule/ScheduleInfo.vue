<template>
  <a-row>
    <a-card title="课表编辑">
      <a-form-model
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        labelAlign="left"
      >
        <a-form-model-item label="学年学期：">
          {{ semester }}
        </a-form-model-item>
        <a-form-model-item label="教室：">
          {{ classroom }}
        </a-form-model-item>
        <a-form-model-item label="课次：">
          {{ schedule }}
        </a-form-model-item>
      </a-form-model>
    </a-card>

    <a-card title="课程信息">
      <template #extra>
        <a-button type="primary" icon="delete"></a-button>
      </template>
      <a-form-model
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        labelAlign="left"
      >
        <a-form-model-item label="课程名称：">
          <a-select> </a-select>
        </a-form-model-item>
        <a-form-model-item label="课程代号：">
          <a-select> </a-select>
        </a-form-model-item>
        <a-form-model-item label="上课周：">
          <a-input></a-input>
        </a-form-model-item>
        <a-form-model-item label="教师姓名：">
          <a-select> </a-select>
        </a-form-model-item>
        <a-form-model-item label="班级名称：">
           <a-select> </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </a-row>
</template>

<script>
export default {
  data() {
    return {
      semester: "2020-2021第一学期",
      classroom: "图书馆-1-A101",
      schedule: "第1-2节",
      courses: [{ name: "数据结构" }, { name: "数据科学" }],
    };
  },
};
</script>

<style>
</style>
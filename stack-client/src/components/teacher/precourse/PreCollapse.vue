<template>
  <a-collapse default-active-key="1" :bordered="false">
    <a-collapse-panel
      v-for="(course, idex) in courses"
      :header="course.coursename"
      :key="idex"
    >
      <a-row v-if="!course.coursehours.length" type="flex" justify="center">
        <a-button
          size="small"
          type="link"
          @click="addcourse(idex, 0)"
          style="text-align: center"
          >添加课时</a-button
        >
      </a-row>
      <a-list :data-source="course.coursehours" @click="courseclick">
        <a-list-item slot="renderItem" slot-scope="item, index" :id="index">
          <a-input
            v-if="course.coursehours[index].editable"
            style="margin: -5px 0"
            :value="item.name"
            ref="courseinput"
            @keyup.enter="(e) => handleChange(idex, index, e.target.value)"
            @blur="(e) => handleChange(idex, index, e.target.value)"
          />
          <span v-else>{{ item.name }}</span>
          <template #extra v-if="!course.coursehours[index].editable">
            <a-button-group>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>编辑</span>
                </template>
                <a-button
                  icon="edit"
                  size="small"
                  type="link"
                  @click="editcourse(idex, index)"
                ></a-button>
              </a-tooltip>
              <a-button
                icon="plus"
                size="small"
                type="link"
                @click="addcourse(idex, index)"
              ></a-button>
              <a-button
                icon="minus"
                size="small"
                type="link"
                @click="deletecourse(idex, index)"
              ></a-button>
            </a-button-group>
          </template>
        </a-list-item>
      </a-list>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
let courses = [
  {
    courseId: "1",
    coursename: "软件工程",
    coursehours: [
      { name: "课时", editable: false },
      { name: "课时", editable: false },
    ],
    editable: false,
  },
  {
    courseId: "2",
    coursename: "高等数学",
    coursehours: [
      { name: "课时", editable: false },
      { name: "课时", editable: false },
    ],
    editable: false,
  },
  {
    courseId: "3",
    coursename: "计算机网络",
    coursehours: [
      { name: "课时", editable: false },
      { name: "课时", editable: false },
    ],
    editable: false,
  },
];
export default {
  data() {
    return {
      courses,
    };
  },
  watch: {},
  methods: {
    courseclick({ target }) {
      console.log(target.id);
    },
    editcourse(idex, index) {
      this.courses[idex].coursehours[index].editable = true;
      this.$nextTick(() => {
        this.$refs.courseinput[0].focus();
      });
    },
    addcourse(idex, index) {
      this.courses[idex].coursehours.splice(index + 1, 0, {
        name: "新增课时",
        editable: false,
      });
    },
    deletecourse(idex, index) {
      this.courses[idex].coursehours.splice(index, 1);
    },
    handleChange(idex, index, value) {
      let coursehour = this.courses[idex].coursehours[index];
      coursehour.name = value;
      coursehour.editable = false;
    },
  },
  computed: {
    ispublished() {
      return true;
    },
  },
};
</script>

<style scoped>
.btn-area {
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
}

.ant-btn[disabled] {
  color: #ffffff;
  background-color: #000000;
  border-color: #000000;
}
.ant-btn {
  color: #ffffff;
}
</style>
<style>
.ant-collapse > .ant-collapse-item > .ant-collapse-header {
  color: #ffffff;
}
.ant-collapse {
  background-color: black;
}
.ant-collapse-content {
  background-color: black;
}

.ant-list {
  color: #ffffff;
}
</style>
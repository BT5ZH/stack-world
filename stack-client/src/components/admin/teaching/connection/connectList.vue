<template>
  <div id="components-form-demo-advanced-search">
    <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
      <a-row :gutter="24">
        <a-col :span="8" label="Fields">
          <p>课程：</p>
          <a-select v-model="lesson" style="width: 100%" @change="lessonchange">
            <a-select-option
              v-for="(item, index) in courseList"
              :key="index"
              :value="item._id"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-col>
        <a-col :span="8">
          <p>教师：</p>
          <a-select v-model="teacher" style="width: 100%">
            <a-select-option
              v-for="(item, index) in teacherList"
              :key="index"
              :value="item._id"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-col>
        <a-col :span="8">
          <p>班级：</p>
          <a-select v-model="classes" mode="multiple" style="width: 100%">
            <a-select-option
              v-for="(item, index) in classList"
              :key="index"
              :value="item._id"
              >{{ item.class_name }}</a-select-option
            >
          </a-select>
        </a-col>
        <a-col :span="8" style="margintop: 20px">
          <p>学年：</p>
          <a-select v-model="year" style="width: 100%">
            <a-select-option
              v-for="(item, index) in yearList"
              :key="index"
              :value="item"
              >{{ item }}</a-select-option
            >
          </a-select>
        </a-col>
        <a-col :span="8" style="margintop: 20px">
          <p>学期：</p>
          <a-select v-model="term" style="width: 100%">
            <a-select-option
              v-for="(item, index) in termList"
              :key="index"
              :value="item"
              >{{ item }}</a-select-option
            >
          </a-select>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" :style="{ textAlign: 'right' }">
          <a-button type="primary" @click="submit">提交</a-button>
        </a-col>
      </a-row>
    </a-form>
    <div class="result-list">
      <result-list :lessonList="lessonList" @refresh="freshen"></result-list>
    </div>
  </div>
</template>
<script>
import axiosInstance from "@/utils/axios";
import { mapState } from "vuex";
import axios from "@/utils/axios";
import moment from "moment";
import ResultList from "./ResultList";

export default {
  components: { ResultList },
  props: {
    orginfo: {
      type: String,
      default: "",
    },
    orgname: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: "advanced_search" }),

      lesson: "请选择课程",
      teacher: "请选择老师",
      classes: "",
      year: "请选择学年",
      term: "请选择学期",

      courseList: [],
      teacherList: [],
      classList: [],
      termList: [],
      lessonList: [],
    };
  },
  computed: {
    yearList() {
      //let year = moment().year();
      //return [year - 1, year, year + 1];
      return [this.school_year];
    },
    ...mapState({
      school_year: (state) => state.public.school_year,
      org_name: (state) => state.public.orgName,
    }),
  },
  mounted() {
    // console.log(this.lessonList)
    this.$store.dispatch("public/getCurrentSchoolYear", this.org_name);
  },
  methods: {
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        console.log("error", error);
        console.log("Received values of form: ", values);
      });
    },
    lessonchange(value) {
      const course = this.courseList.find((item) => value === item._id);
      if (course.semester % 2 == 0) {
        this.termList = "2";
      } else {
        this.termList = "1";
      }
    },
    getOrgInfo() {
      const [major_name, subOrg_name] = this.orginfo.split(":");
      this.$store.dispatch("admin/change_spin_status", true);
      axios
        .post("/pc/v1/courses/getCourseTeacherClassByOrg", {
          org_name: this.orgname,
          subOrg_name,
          major_name,
        })
        .then(({ data }) => {
          // console.log("-----getOrgInfo------")
          // console.log(data);
          this.$store.dispatch("admin/change_spin_status", false);
          this.courseList = data.courses;
          this.teacherList = data.teachers;
          this.classList = data.classes;
          this.lessonList = data.lessonlist;
          // console.log( this.lessonList)
        })
        .catch((err) => {
          console.error(err);
        });
    },
    submit() {
      const postData = {
        course_id: this.lesson,
        teacher_id: this.teacher,
        classes: this.classes,
        year: this.year.toString(),
        semester: Number.parseInt(this.term),
      };
      axios
        .post("pc/v1/lessons/", postData)
        .then(({ data }) => {
          const { status } = data;
          if (!status) throw "connect course fail";
          this.$message.success("关联课程成功");
          this.freshen();
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("关联课程失败");
        });
    },
    handleReset() {
      this.form.resetFields();
    },
    toggle() {
      this.expand = !this.expand;
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    handleBlur() {
      console.log("blur");
    },
    handleFocus() {
      console.log("focus");
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    freshen() {
      this.getOrgInfo();
      // this.submit();
    },
  },
  watch: {
    orginfo(value) {
      this.getOrgInfo();
    },
  },
};
</script>
<style>
.ant-advanced-search-form {
  padding: 24px;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}

#components-form-demo-advanced-search .ant-form {
  max-width: none;
}
#components-form-demo-advanced-search .result-list {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  padding-top: 80px;
}
</style>

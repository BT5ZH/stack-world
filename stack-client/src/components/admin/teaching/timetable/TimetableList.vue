<template>
  <div id="components-form-demo-advanced-search">
    <a-form
      class="ant-advanced-search-form"
      :form="form"
      @submit="handleSearch"
    >
      <a-row :gutter="24">
        <a-col :span="8" label="Fields">
          <p>教学年份：</p>
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
          <p>第几学期：</p>
          <a-select v-model="term" style="width: 100%">
            <a-select-option
              v-for="(item, index) in termList"
              :key="index"
              :value="item"
              >{{ item }}</a-select-option
            >
          </a-select>
        </a-col>
        <a-col :span="8">
          <p>教学周数：</p>
          <a-select v-model="week" style="width: 100%">
            <a-select-option
              v-for="(item, index) in weekList"
              :key="index"
              :value="item"
              >{{ item }}</a-select-option
            >
          </a-select>
        </a-col>
        <a-col :span="8">
          <p>起止日期：</p>
          <a-range-picker v-model="datevalue" @change="onChange">
            <a-icon slot="suffixIcon" type="smile" />
          </a-range-picker>
          <p>设置为当前学期：</p>
          <a-select v-model="seme" style="width: 50%">
            <a-select-option
              v-for="(item, index) in SemeList"
              :key="index"
              :value="item"
              >{{ item }}</a-select-option
            >
          </a-select>
        </a-col>

        <a-col :span="8" :style="{ textAlign: 'right' }">
          <p>开始时间：</p>
          <a-time-picker
            v-model="timestart"
            format="HH:mm"
            @change="onChangeOfStart"
          />
          <p>结束时间：</p>
          <a-time-picker
            v-model="timeend"
            format="HH:mm"
            @change="onChangeOfEnd"
          />
          <p></p>
          <a-button @click="addTime">添加</a-button>
          <a-button @click="delTime">清空</a-button>
        </a-col>
        <a-col :span="8">
          <p>教学日每节课时间安排表：</p>
          <a-list size="small" bordered :data-source="data">
            <a-list-item
              :style="{ textAlign: 'center' }"
              slot="renderItem"
              slot-scope="timeitem"
            >
              {{ timeitem }}
            </a-list-item>
            <div :style="{ textAlign: 'center' }" slot="header">
              开始时间------｜------结束时间
            </div>
          </a-list>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" :style="{ textAlign: 'left' }">
          <a-button type="primary" @click="submit">提交</a-button>&nbsp;&nbsp;
          <a-button type="primary" @click="reset">重置</a-button>
        </a-col>
      </a-row>
    </a-form>
    <div class="schoolyear-list">
      <schoolyear-list
        @showSelected="showSelectedSchoolyear"
        :child_refresh="refresh"
      ></schoolyear-list>
    </div>
  </div>
</template>
<script>
//const courseTimeData = [];@refresh="parent_refresh"

import axiosInstance from "@/utils/axios";
import { mapState } from "vuex";
import axios from "@/utils/axios";
import moment from "moment";
import SchoolyearList from "./SchoolyearList";

export default {
  components: { SchoolyearList },

  data() {
    return {
      form: this.$form.createForm(this, { name: "advanced_search" }),
      week: "请选择周数",
      year: "请选择学年",
      term: "请选择学期",
      datevalue: null,
      seme: "否",
      SemeList: ["是", "否"],
      weekList: [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5],
      termList: [1, 2, 3, 4],
      startTime: "", //moment().format("HH:MM"),
      endTime: "", //moment().format("HH:MM"),

      timestart: "",
      timeend: "",
      startDate: "",
      endDate: "",
      course_time: [],
      data: [],
      timeitem: "",
      refresh: 1,
      index: 1,
      oneSY: {},
    };
  },
  computed: {
    yearList() {
      let year = moment().year();
      return [
        year - 2 + "-" + (year - 1),
        year - 1 + "-" + year,
        year + "-" + (year + 1),
        year + 1 + "-" + (year + 2),
      ];
    },
    ...mapState({
      Tree_spin_status: (state) => state.admin.Tree_spin_status,
      uid: (state) => state.public.uid,
      oid: (state) => state.public.oid,
      org_name: (state) => state.public.orgName,
    }),
  },

  mounted() {
    //this.$store.dispatch("public/getCurrentSchoolYear");
    //this.$store.dispatch("public/getOrgnizationName", this.oid);
  },
  methods: {
    moment,
    // parent_refresh(ss) {
    //   this.refresh += ss;
    // },
    showSelectedSchoolyear(record) {
      if (record != null) {
        this.year = record.year;
        this.week = record.weeks;
        this.term = record.semester;
        this.startDate = moment(record.start_time).format("YYYY-MM-DD");
        this.endDate = moment(record.end_time).format("YYYY-MM-DD");
        this.datevalue = [
          moment(record.start_time, "YYYY-MM-DD"),
          moment(record.end_time, "YYYY-MM-DD"),
        ];
        this.seme = record.current;
        this.course_time = record.course_time;
        this.data = [];
        let tmp = [];
        for (let i = 0; i < record.course_time.length; i++) {
          this.index = i + 1;
          this.startTime = record.course_time[i].begin_time;
          this.endTime = record.course_time[i].end_time;
          this.timeitem =
            "第" +
            this.index +
            "节课： " +
            this.startTime +
            " 至 " +
            this.endTime;
          tmp.push(this.timeitem);
        }
        this.data = tmp;
        if (record.course_time.length != 0) this.index++;
        this.startTime = "";
        this.endTime = "";
        this.oneSY = record;
      } else {
        this.week = "请选择周数";
        this.year = "请选择学年";
        this.term = "请选择学期";
        this.datevalue = "";
        this.seme = "否";
        this.timestart = "";
        this.timeend = "";
        this.oneSY = {};
        this.delTime();
      }
    },
    reset() {
      this.week = "请选择周数";
      this.year = "请选择学年";
      this.term = "请选择学期";
      this.datevalue = null;
      this.seme = "否";
      this.timestart = "";
      this.timeend = "";
      this.oneSY = {};
      this.delTime();
    },
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {});
    },
    addTime() {
      if (this.startTime === "" || this.endTime === "")
        this.$message.error("请选择开始和结束时间");
      else {
        this.timeitem =
          "第" +
          this.index +
          "节课： " +
          this.startTime +
          " 至 " +
          this.endTime;
        this.index += 1;
        this.data.push(this.timeitem);
        this.course_time.push({
          begin_time: this.startTime,
          end_time: this.endTime,
        });
      }
    },
    delTime() {
      this.course_time = [];
      this.data = [];
      this.index = 1;
    },
    submit() {
      let isCurrent = "f";
      if (this.seme === "是") isCurrent = "t";

      const postData = {
        org_name: this.org_name,
        start_time: this.startDate,
        end_time: this.endDate,
        current: isCurrent,
        weeks: Number.parseInt(this.week),
        year: this.year,
        semester: Number.parseInt(this.term),
        course_time: this.course_time,
      };
      if (this.seme === "是") {
        axios
          .post("pc/v1/schoolyears/changeCurrentSYtoNomarl")
          .then(({ data }) => {
            // console.log(data);
            const { status } = data;
            if (!status) throw "fail";
          })
          .catch((err) => {
            console.error(err);
          });
      }

      if (this.oneSY._id == null) {
        //add a new schoolyear record
        if (
          this.week != "请选择周数" &&
          this.year != "请选择学年" &&
          this.term != "请选择学期"
        ) {
          axios
            .post("pc/v1/schoolyears/addSchoolYear", postData)
            .then(({ data }) => {
              const { status } = data;
              if (!status) throw "fail";
              this.$message.success("学年创建成功");
              this.refresh += 1;
            })
            .catch((err) => {
              console.error(err);
              this.$message.error("学年创建失败");
            });
        } else {
          this.$message.error("请选择学年、学期、周数等必备信息！");
        }
      } else {
        //update the selected schoolyear record
        axios
          .patch("pc/v1/schoolyears/" + this.oneSY._id, postData)
          .then(({ data }) => {
            const { status } = data;
            if (!status) throw "fail";
            this.$message.success("学年更新成功");
            this.refresh += 1;
          })
          .catch((err) => {
            console.error(err);
            this.$message.error("学年更新失败");
          });
      }
    },

    onChange(date, dateString) {
      //console.log(date, dateString);
      this.startDate = dateString[0];
      this.endDate = dateString[1];
      console.log(this.startDate + "+" + this.endDate);
    },
    onChangeOfStart(time, timeString) {
      this.startTime = timeString;
      //console.log(time, timeString);
    },
    onChangeOfEnd(time, timeString) {
      this.endTime = timeString;
      //console.log(time, timeString);
    },
  },
  watch: {
    //refresh(val) {
    // this.getStudents();
    //},
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

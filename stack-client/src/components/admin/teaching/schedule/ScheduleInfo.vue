<template>
  <div>
    <a-row>
      <a-col>
        <span>
          <a-select v-model="year" style="width: 120px">
            <a-select-option
              v-for="(item, index) in yearList"
              :key="index"
              :value="item"
              >{{ item }}</a-select-option
            >
          </a-select>
          <a-select v-model="semester" style="width: 120px">
            <a-select-option value="1"> 第一学期 </a-select-option
            ><a-select-option value="2"> 第二学期 </a-select-option>
          </a-select>
        </span>
        <a-select
          default-value="place"
          style="width: 120px"
          @change="styleChange"
        >
          <a-select-option value="place"> 按地点查询 </a-select-option>
          <a-select-option value="people"> 按人员查询 </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row>
      <a-tree-select
        v-if="style === 'place'"
        style="width: 100%"
        :value="value"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :placeholder="orgName"
        allow-clear
        tree-default-expand-all
        @change="onChangerooms"
      >
        <a-tree-select-node
          :selectable="false"
          :key="campus.campus_name"
          :value="`${campus._id}#`"
          :title="campus.campus_name"
          v-for="campus in campusList"
        >
          <a-tree-select-node
            :key="buildings.building_name"
            :value="`${campus._id}:${buildings._id}`"
            :title="buildings.building_name"
            v-for="buildings in campus.buildings"
          >
          </a-tree-select-node>
        </a-tree-select-node>
      </a-tree-select>
      <a-tree-select
        v-else
        style="width: 100%"
        :value="value"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :placeholder="orgName"
        allow-clear
        tree-default-expand-all
        @change="onTreeChange"
      >
        <a-tree-select-node
          :selectable="false"
          :key="item._id"
          :value="`${item._id}#`"
          :title="item._id"
          v-for="item in peopleTreeList"
        >
          <a-tree-select-node
            :key="title"
            :value="`${item._id}:${title}`"
            :title="title"
            v-for="title in item.title"
          >
          </a-tree-select-node>
        </a-tree-select-node>
      </a-tree-select>
    </a-row>
    <a-spin :spinning="Card_spin_status" tip="Loading...">
      <a-card>
        <a-card-grid
          style="width: 25%; text-align: center"
          :key="item.cardData"
          :value="`${item.cardData}`"
          v-for="item in cardData"
          @click="changeCard(item.cardData, item.cardShow)"
        >
          {{ item.cardShow }}
        </a-card-grid>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axios";
import moment from "moment";
import { mapState } from "vuex";
export default {
  data() {
    return {
      Card_spin_status: false,
      // 选择
      year: "", //moment().year(),
      semester: "1",
      style: "place",
      value: "",
      campusList: [],
      peopleTreeList: [],
      // 卡片
      cardData: [],
      courseTabledata: [],
      // 缓存信息
      building_name: "",
    };
  },
  computed: {
    yearList() {
      // let year = moment().year();
      // let lastyear = year - 1;
      // let nextyear = year + 1;
      // return [lastyear.toString(), year.toString(), nextyear.toString()];
      return [this.school_year];
    },
    ...mapState({
      uid: (state) => state.public.uid,
      Tree_spin_status: (state) => state.admin.Tree_spin_status,
      spin_status: (state) => state.admin.spin_status,
      oid: (state) => state.public.oid,
      orgName: (state) => state.public.orgName,
      school_year: (state) => state.public.school_year,
    }),
  },
  mounted() {
    this.getSpaceTree();
    this.getTreeList();
    this.$store.dispatch("public/getCurrentSchoolYear", this.orgName);
  },

  methods: {
    // 地点树
    async getSpaceTree() {
      let queryString = "";
      const url = "/pc/v1/campus" + queryString;
      try {
        this.$store.dispatch("admin/change_Tree_spin_status", true);
        const { data } = await axiosInstance.get(url);
        this.$store.dispatch("admin/change_Tree_spin_status", false);
        this.campusList = data.data.campus;
        // console.log("----cam-----")
        // console.log(this.campusList)
      } catch (err) {
        console.log(err);
      }
    },
    // 人员树
    async getTreeList() {
      try {
        // console.log(this.orgName);
        const url =
          "/pc/v1/users/getUsersBySubOrgAndSortByTitle?org_name=" +
          this.orgName;
        this.$store.dispatch("admin/change_Tree_spin_status", true);
        const { data } = await axiosInstance(url);
        this.$store.dispatch("admin/change_Tree_spin_status", false);
        // console.log("---this.peopleTreeList---");
        // console.log(this.peopleTreeList);
        // console.log(data.result);
        data.result.map((item) => {
          let middle = item.title;
          // console.log(middle)
          // item.title = middle.filter((temp) => {
          //   // console.log(temp)
          //   temp == "学生";
          // });
          let test = [];
          for (let i = 0; i < middle.length; i++) {
            if (middle[i] != "学生") test.push(middle[i]);
          }
          item.title = test;
        });
        // console.log(data.result)
        this.peopleTreeList = data.result;
      } catch (err) {
        console.log(err);
      }
    },
    async onTreeChange(value, label) {
      let payload = {};
      // console.log("---value---")
      // console.log(value)
      let dataArray = value.split(":");
      let secString = "";
      switch (dataArray[1]) {
        case "教授":
          secString = "professor";
          break;
        case "副教授":
          secString = "vice-professor";
          break;
        case "讲师":
          secString = "lecturer";
          break;
        // case "学生":
        //   secString = "student";
        // break;
        default:
          break;
      }
      payload = {
        subOrg_name: dataArray[0],
        title: secString,
      };
      this.getPeopleFromCondition(payload);
    },
    async getPeopleFromCondition(payload) {
      // console.log(payload);
      const url =
        "/pc/v1/users?subOrg_name=" +
        payload.subOrg_name +
        "&title=" +
        payload.title +
        "&org_name=" +
        this.orgName;
      try {
        this.$store.dispatch("admin/change_spin_status", true);
        const { data } = await axiosInstance.get(url);
        this.$store.dispatch("admin/change_spin_status", false);
        // console.log(data.users);
        this.cardData = [];
        data.users.map((item) => {
          let temp = {
            cardShow: item.name,
            cardData: item._id,
          };
          this.cardData.push(temp);
        });
        // console.log("---card-----");
        // console.log(this.cardData);
      } catch (err) {
        console.log(err);
      }
    },
    styleChange(value) {
      // console.log(value)
      this.style = value;
      // console.log(`selected ${value}`);
    },
    async onChangerooms(value, label) {
      this.flag = value;
      let payload = {};
      let dataArray = this.flag.split(":");
      // console.log("---dataArray---")
      // console.log(label)
      this.building_name = label[0];
      this.getRoomsFromCondition(dataArray[1]);
    },
    async getRoomsFromCondition(building_id) {
      const url =
        "/pc/v1/rooms/getRoomByBuilding?building_id=" +
        building_id +
        "&year=" +
        this.year +
        "&semester=" +
        this.semester;
      try {
        // this.$store.dispatch("admin/change_spin_status", true);
        this.Card_spin_status = true;
        const { data } = await axiosInstance.get(url);
        // this.$store.dispatch("admin/change_spin_status", false);
        this.Card_spin_status = false;
        // console.log("---data---")
        // console.log(data)
        // console.log(data.rooms.rooms);
        this.cardData = [];
        data.rooms.rooms.map((item) => {
          let temp = {
            cardShow: item.room_number,
            cardData: item._id,
          };
          this.cardData.push(temp);
        });
        // console.log("---card-----");
        // console.log(this.cardData);
        // this.roomList = data.data.rooms;
      } catch (err) {
        console.log(err);
      }
    },
    // 卡片
    changeCard(record, label) {
      // console.log("---record---")
      // console.log(record)
      // console.log(label)
      if (this.style === "place") {
        let url =
          "/pc/v1/timetables/getTimeTableFromRoomID?room_id=" +
          record +
          "&semester=" +
          this.semester +
          "&year=" +
          this.year;
        this.getTimeTableFromRoomID(url, label);
      } else {
        // console.log("---record---");
        // console.log(queryString);
        let url = "/pc/v1/timetables/getTimeTableFromTeacherID";
        let queryString = {
          teacher_id: record,
          semester: this.semester,
          year: this.year,
        };
        // console.log(queryString);
        this.$store.dispatch("admin/change_spin_status", true);
        this.getTimeTableFromRoomID(url, queryString);
        this.$store.dispatch("admin/change_spin_status", false);
      }
    },
    async getTimeTableFromRoomID(url, label) {
      // console.log(this.style);
      try {
        let newCourseTabledata;
        if (this.style === "place") {
          this.$store.dispatch("admin/change_spin_status", true);
          const { data } = await axiosInstance.get(url);
          this.$store.dispatch("admin/change_spin_status", false);
          // console.log(data.result);
          newCourseTabledata = data.result.map((item) => {
            let week = "全周";
            if (item.odd_or_even === 1) week = "单周";
            else if (item.odd_or_even === 2) week = "双周";
            return {
              show: {
                course_name: item.course_name,
                week: week,
                building_name: this.building_name,
                room_name: label,
              },
              _id: item._id,
              match: {
                semester: this.semester,
                year: this.year,
                date: item.date,
                order: item.order,
              },
            };
          });
        } else {
          this.$store.dispatch("admin/change_spin_status", true);
          const { data } = await axiosInstance.post(url, label);
          this.$store.dispatch("admin/change_spin_status", false);
          // console.log("---people data---");
          // console.log(data.result);
          newCourseTabledata = data.result.map((item) => {
            let middle = item.curriculum.map((temp) => {
              let week = "全周";
              if (temp.odd_or_even === 1) week = "单周";
              else if (temp.odd_or_even === 2) week = "双周";
              return {
                show: {
                  course_name: item.course_id.name,
                  week: week,
                  building_name: item.teacher_id.name,
                  room_name: "",
                },
                _id: item._id,
                match: {
                  semester: this.semester,
                  year: this.year,
                  date: temp.date,
                  order: temp.order,
                },
              };
            });
            return middle;
          });
          let CourseTabledata = [];
          for (let i = 0; i < newCourseTabledata.length; i++) {
            for (let j = 0; j < newCourseTabledata[i].length; j++) {
              CourseTabledata.push(newCourseTabledata[i][j]);
              // console.log(newCourseTabledata[i][j])
            }
          }
          // console.log(newCourseTabledata.length);
          // console.log(newCourseTabledata[i].length);
          // console.log(CourseTabledata);
          newCourseTabledata = CourseTabledata;
        }
        this.$emit("courseTableData", newCourseTabledata);
      } catch (err) {
        this.$message.error("没有排课");
        this.$emit("courseTableData", []);
        console.log(err);
      }
    },
  },
};
</script>

<style></style>

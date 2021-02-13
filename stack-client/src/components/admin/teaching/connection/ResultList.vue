<template>
  <a-row class="container">
    <a-row>
      <a-spin :spinning="spin_status" tip="Loading...">
        <a-table
          rowKey="lesson_id"
          :columns="columns"
          :data-source="lessonList"
          bordered
          :pagination="{
            'show-less-items': true,
            'show-size-changer': true,
            'show-quick-jumper': true,
            'hide-on-single-page': true,
          }"
        >
          <template #classes="classList">
            <div v-for="(item, index) in classList" :key="index">
              <span>{{ item.class_name }}</span>
              <br />
            </div>
          </template>
          <template #operation="record">
            <a @click="edit(record)">编辑</a>
            &nbsp;&nbsp;
            <a @click="relieve(record)" v-on:click="$emit('refresh')"
              >解除关联</a
            >
          </template>
        </a-table>
      </a-spin>
    </a-row>
    <a-modal
      width="800px"
      v-model="editModal_visible"
      title="课程管理"
      @ok="edit_submit"
    >
      <!--  -->
      <div>
        <a-table
          bordered
          :data-source="dataSource.curriculum"
          :columns="courseMan_column"
          :pagination="{
            'show-less-items': true,
            'show-size-changer': true,
            'show-quick-jumper': true,
            'hide-on-single-page': true,
          }"
        >
          <template slot="operation" slot-scope="text, record">
            <a-popconfirm
              v-if="dataSource.curriculum.length"
              title="Sure to delete?"
              @confirm="() => onDelete(record.key)"
            >
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
        <br />
        <a-button class="editable-add-btn" @click="handleAdd"> 添加 </a-button>
      </div>
      <a-form
        :modal="edit_message"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-model-item label="班级">
          <a-select
            style="width: 100%"
            v-model="edit_message.class_id._id"
            @change="Class_change"
          >
            <a-select-option v-for="class_item in classes" :key="class_item.id">
              {{ class_item.class_name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 校区与楼 -->
        <a-form-model-item label="校区楼">
          <a-tree-select
            v-model="edit_message.address_text"
            :value="value"
            allow-clear
            tree-default-expand-all
            @change="onChange"
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
        </a-form-model-item>
        <a-form-model-item label="教室">
          <a-select
            v-model="edit_message.room_id._id"
            style="width: 100%"
            @change="room_change"
          >
            <a-select-option v-for="room in rooms" :key="room._id">
              编号：{{ room.room_number }} -- 类型： {{ room.room_type }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="单双周">
          <a-radio-group
            name="radioGroup"
            :default-value="0"
            v-model="edit_message.odd_or_even"
          >
            <a-radio :value="0"> 全周 </a-radio>
            <a-radio :value="1"> 单周 </a-radio>
            <a-radio :value="2"> 双周 </a-radio>
          </a-radio-group>
          <!-- @change="onChange1" -->
        </a-form-model-item>
        <a-form-model-item label="周几">
          <!-- <a-input v-model="form.title" /> -->
          <a-select v-model="edit_message.date">
            <a-select-option
              v-for="course_date in dateData"
              :key="course_date.data"
            >
              {{ course_date.show }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="时间">
          <a-select
            v-model="edit_message.order"
            mode="multiple"
            style="width: 100%"
            placeholder="选择第几节上课"
          >
            <a-select-option v-for="i in 10" :key="i">
              {{ i }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form>
    </a-modal>
  </a-row>
</template>

<script>
import axiosInstance from "@/utils/axios";
import { mapState } from "vuex";

// 编辑信息
const dateData = [
  { show: "星期一", data: "Mon" },
  { show: "星期二", data: "Tue" },
  { show: "星期三", data: "Wed" },
  { show: "星期四", data: "Thu" },
  { show: "星期五", data: "Fri" },
  { show: "星期六", data: "Sat" },
  { show: "星期日", data: "Sun" },
];

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
      // 编辑信息
      dataSource: {
        // {
        //   key: "0",
        //   Campus: "长安",
        //   building: "文津楼",
        //   room: "1518",
        //   class: "软工1901",
        //   odd_or_even: "单周",
        //   date: "Mon",
        //   order: "12",
        // },
      },
      courseMan_column: [
        {
          title: "校区",
          dataIndex: "room_id.campus_name",
          scopedSlots: { customRender: "room_id.campus_name" },
        },
        {
          title: "楼",
          dataIndex: "room_id.building_name",
        },
        {
          title: "教室",
          dataIndex: "room_id.room_number",
        },
        {
          title: "班级",
          dataIndex: "class_id.class_name",
        },
        {
          title: "单双周",
          dataIndex: "week",
        },
        {
          title: "周几",
          dataIndex: "date",
        },
        {
          title: "时间",
          dataIndex: "order",
        },
        {
          title: "operation",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
      refresh: 1,
      classes: {},
      value: undefined,
      campusList: [],
      dateData,
      rooms: [],
      value1: "单周",
      flag: "",
      // 编辑
      editModal_visible: false,
      edit_message: {
        // 显示
        // room_number: "",
        week: "",
        room_id: {
          room_number: "",
          _id: "",
          building_name: "",
          campus_name: "",
        },
        class_id: { _id: "", class_name: "" },
        address_text: this.orgName,
        // 传入后端
        lesson_id: "",
        odd_or_even: "",
        date: "",
        order: [],
      },
    };
  },
  computed: {
    ...mapState({
      orgName: (state) => state.public.orgName,
      spin_status: (state) => state.admin.spin_status,
    }),
  },
  mounted() {
    //获取下拉列表数据
    this.spaceList();
    // this.getSpace();
  },
  watch: {
    refresh(val) {
      console.log("---refresh---");
      // this.dataSource = {};
      this.get_lessonManages();
    },
  },
  methods: {
    // 编辑表格
    async get_lessonManages() {
      // 寻找
      const url = "/pc/v1/timetables/getTimeTableFromLessonID";
      const lesson_id = this.edit_message.lesson_id;
      const request = { lesson_id: this.edit_message.lesson_id };
      try {
        // console.log(request);
        // this.$store.dispatch("admin/change_spin_status",true)
        const { data } = await axiosInstance.post(url, request);
        // this.$store.dispatch("admin/change_spin_status",false)
        // console.log("---data.data[0].curriculum---");
        // console.log(data.data[0]);
        this.dataSource = data.data[0];
        let i = 0;
        let middle;
        middle = data.data[0].curriculum.map((item) => {
          let oddoreven = "全周";
          if (item.odd_or_even === 1) oddoreven = "单周";
          else if (item.odd_or_even === 2) oddoreven = "双周";
          i++;
          return {
            week: oddoreven,
            key: i,
            ...item,
          };
        });
        this.dataSource.curriculum = middle;
        // console.log("---dataSource---")
        // console.log(this.dataSource.curriculum)
      } catch (err) {
        this.dataSource = {};
        console.log(err);
      }
      // console.log(lesson_id)
    },
    // onCellChange(key, dataIndex, value) {
    //   const dataSource = [...this.dataSource.curriculum];
    //   const target = dataSource.find((item) => item.key === key);
    //   if (target) {
    //     target[dataIndex] = value;
    //     this.dataSource.curriculum = dataSource;
    //   }
    // },
    onDelete(key) {
      // console.log("----key----");
      // console.log(this.dataSource.curriculum);
      // this.dataSource.curriculum.splice(key-1,1)
      let temp = this.dataSource.curriculum;
      this.dataSource.curriculum = temp.filter((item) => item.key !== key);
    },
    handleAdd() {
      // console.log("edit_message-----");
      // console.log(this.edit_message);
      if (
        this.edit_message.class_id._id == "" ||
        this.edit_message.date == "" ||
        this.edit_message.room_id._id == "" ||
        this.edit_message.order.length == 0 ||
        this.edit_message.odd_or_even === ""
      ) {
        this.$message.error("请将信息填写完整");
        return;
      }
      let temp = this.dataSource.curriculum;
      // console.log("----dataSource-----")
      // console.log(this.dataSource)
      // 拼单双周
      this.edit_message.week = "全周";
      if (this.edit_message.odd_or_even === 1) this.edit_message.week = "单周";
      else if (this.edit_message.odd_or_even === 2)
        this.edit_message.week = "双周";
      // 拼楼层
      this.edit_message.room_id.building_name = this.edit_message.address_text;
      // 添加
      let newData = {
        class_id: {
          class_name: this.edit_message.class_id.class_name,
          _id: this.edit_message.class_id._id,
        },
        date: this.edit_message.date,
        key: 0,
        odd_or_even: this.edit_message.odd_or_even,
        order: this.edit_message.order,
        room_id: {
          building_name: this.edit_message.room_id.building_name,
          campus_name: this.edit_message.room_id.campus_name,
          room_number: this.edit_message.room_id.room_number,
          _id: this.edit_message.room_id._id,
        },
        week: this.edit_message.week,
      };
      // console.log("-----newData-----")
      // console.log(newData)
      // console.log(this.dataSource.curriculum != null);
      if (this.dataSource.curriculum != null) {
        newData.key = this.dataSource.curriculum.length + 1;
        this.dataSource.curriculum = [...temp, Object.assign({}, newData)];
      } else {
        newData.key = 1;
        this.dataSource = { curriculum: [Object.assign({}, newData)] };
      }
      // console.log(Object.assign({}, newData));
      // console.log("----dataSource.curriculum----")
      // console.log(this.dataSource.curriculum)
    },
    // 编辑
    room_change(record) {
      let change_room = this.rooms.map((item) => {
        if (item._id === record) {
          this.edit_message.room_id.room_number = item.room_number;
        }
      });
      // console.log(this.edit_message.room_id);
    },
    Class_change(record) {
      // console.log(record);
      // console.log(this.classes);
      let change_room = this.classes.map((item) => {
        if (item._id === record) {
          this.edit_message.class_id.class_name = item.class_name;
        }
      });
    },
    onChange(value, label) {
      // 拼接校区
      this.edit_message.address_text = label;
      this.flag = value;
      let payload = {};
      let dataArray = this.flag.split(":");
      this.campusList.map((item) => {
        if (item._id === dataArray[0]) {
          this.edit_message.room_id.campus_name = item.campus_name;
        }
      });
      // console.log(dataArray);
      payload = {
        campus_id: dataArray[0],
        building_id: dataArray[1],
      };
      // console.log(payload);
      this.getRooms(payload);
      // }
    },
    // async
    getRooms(payload) {
      const url =
        "/pc/v1/rooms/getRoomByCampusOrBuilding" +
        "?building_id=" +
        payload.building_id;

      this.$store
        .dispatch("admin/getTreeByURL", url)
        .then((response) => {
          // console.log(response);
          this.rooms = response.data.data.rooms;
        })
        .catch((error) => {
          console.log(error);
        });

      // const { data } = await axiosInstance.get(url);
      // this.rooms = data.data.rooms;
      // console.log("data rooms------")
      // console.log(data.data.rooms)
    },
    // async
    spaceList() {
      let queryString = "";
      const url = "/pc/v1/campus" + queryString;
      this.$store
        .dispatch("admin/getTreeByURL", url)
        .then((response) => {
          // console.log(response);
          this.campusList = response.data.data.campus;
        })
        .catch((error) => {
          console.log(error);
        });
      // try {
      //   const { data } = await axiosInstance.get(url);
      //   this.campusList = data.data.campus;
      //   console.log("-----campusList-----")
      //   console.log(this.campusList);
      // } catch (err) {
      //   console.log(err);
      // }
    },
    edit(record) {
      this.refresh += 1;
      this.edit_message.lesson_id = record.lesson_id;
      this.classes = record.classes;
      this.editModal_visible = true;
      // 编辑
    },
    edit_submit() {
      // console.log("-----dataSource-----");
      // console.log(this.dataSource);
      if (this.dataSource._id == null) {
        // 无timetable，创建一个
        let request = {
          lesson_id: this.edit_message.lesson_id,
          curriculum: this.dataSource.curriculum,
        };
        let temp = request.curriculum;
        const url = "/pc/v1/timetables";
        request.curriculum = temp.map((item) => {
          return {
            class_id: item.class_id._id,
            room_id: item.room_id._id,
            odd_or_even: item.odd_or_even,
            order: item.order,
            date: item.date,
          };
        });
        // console.log("---request---");
        // console.log(request);
        axiosInstance
          .post(url, request)
          .then((res) => {
            this.$message.info("提交成功");
          })
          .catch((err) => {
            this.$message.error("提交失败");
            console.log(err);
          });
        this.dataSource = [];
        this.editModal_visible = false;
      } else {
        let request = {
          _id: this.dataSource._id,
          curriculum: this.dataSource.curriculum,
        };
        let temp = request.curriculum;
        request.curriculum = temp.map((item) => {
          return {
            class_id: item.class_id._id,
            room_id: item.room_id._id,
            odd_or_even: item.odd_or_even,
            order: item.order,
            date: item.date,
          };
        });
        const url = "/pc/v1/timetables/" + request._id;
        // console.log("---request---");
        // console.log(request);
        const { data } = axiosInstance
          .patch(url, { curriculum: request.curriculum })
          .then((res) => {
            // console.log("----upateData----")
            // console.log(data);
            this.$message.info("提交成功");
          })
          .catch((err) => {
            console.log(err);
          });
        (this.dataSource = []), (this.editModal_visible = false);
      }
    },
    relieve({ lesson_id }) {
      const url = `/pc/v1/lessons/${lesson_id}`;
      axiosInstance
        .delete(url)
        .then(({ data }) => {
          // console.log(data);
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

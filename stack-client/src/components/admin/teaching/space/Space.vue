<template>
  <div>
    <a-row class="container">
      <a-row :span="20" style="margin: 10px 25px 20px 5px;">
        <a-tree-select style="width: 100%" :value="value" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :placeholder="orgName" allow-clear tree-default-expand-all @change="onChange" @search="onSearch"
          @select="onSelect">
          <a-tree-select-node :key="campus.campus_name" :value="`${campus._id}#`" :title="campus.campus_name"
            v-for="campus in campusList">
            <a-tree-select-node :key="buildings.building_name" :value="`${buildings._id}`"
              :title="buildings.building_name" v-for="buildings in campus.buildings">
            </a-tree-select-node>
          </a-tree-select-node>
        </a-tree-select>
      </a-row>
      <a-row>
        <a-col :span="5">
          <a-input></a-input>
        </a-col>
        <a-col :span="5">
          <a-button type="primary">添加校区</a-button>
        </a-col>
        <a-col :span="5"> 你好</a-col>
        <a-col :span="5">
          <a-button type="primary" @click="bulkImport_visible = true">批量添加{{ spaceName }}</a-button>
          <!-- <a-button type="primary">添加教室</a-button> -->
          <a-button type="primary" @click="showDeleteConfirm(checkedList)">批量删除</a-button>
        </a-col>
      </a-row>
      <a-row :span="20">
        <a-tabs :active-key="activeIndex" @change="callback">
          <a-tab-pane key="1" tab="统计信息">
            <space-card class="class-card" :roomsProp="roomNum" :buildingNum="currentBuilding" :typeProp="typeNum"
              :buildingProp="buildingNum"></space-card>
          </a-tab-pane>
          <a-tab-pane key="2" tab="建筑房间列表" force-render>

          </a-tab-pane>
        </a-tabs>
      </a-row>
    </a-row>

    <a-modal v-model="bulkImport_visible" title="批量导入" @ok="bulkimportSubmit">
      <a-upload name="file" :multiple="true" :action="upload_url" @change="handleChange">
        <a-button type="primary">
          <a-icon type="upload" /> 上传文件
        </a-button>
      </a-upload>
      <br />
      <br />
      <a-button @click="download">下载模板</a-button>
    </a-modal>
  </div>
</template>

<script>
  import SpaceCard from "./SpaceCard";
  import axiosInstance from "@/utils/axios";
  import { mapState } from "vuex";
  export default {
    components: { SpaceCard },
    data() {
      return {
        value: undefined,
        campusList: [],
        roomNum: 0,
        buildingNum: 0,
        typeNum: 0,
        currentBuilding: "",
        upload_url: "",
        bulkImport_visible: false,
        spaceName: "",
        colors: [
          "#9FE6B8",
          "#FFDb5C",
          "#FF9F7F",
          "#F87293",
          "#8378EA",
          "#E7bCF3",
          "#96BFFF",
        ],
        // campusName: "",
        // campusId: "",
        activeIndex: "1",
        flag: "",
      };
    },
    computed: {
      ...mapState({
        uid: (state) => state.public.uid,
        oid: (state) => state.public.oid,
        orgName: (state) => state.public.org_name,
      }),
    },
    methods: {
      async onChange(value, label) {
        console.log("onchange:  value " + value);
        console.log("onchange:   label" + label);
        this.activeIndex = "2";
        // this.campusId = value;
        this.flag = value;
        this.callback("2");

        this.value = this.label;
      },
      onSearch() {
        console.log(...arguments);
      },
      onSelect() {
        console.log("selected:   ");
        console.log(...arguments);
      },
      async spaceList() {
        let queryString = "";
        const url = "/pc/v1/campus" + queryString;
        try {
          const { data } = await axiosInstance.get(url);
          this.campusList = data.data.campus;
          console.log(this.campusList);
        } catch (err) {
          console.log(err);
        }
      },
      callback(key) {
        console.log(key);
        if (key == "1") {
          this.activeIndex = "1";
        } else if (key == "2") {
          console.log("3333");
          let payload = {};
          this.activeIndex = "2";
          if (this.flag.slice(-1) == "#") {
            console.log("****");
            let temp = this.flag.slice(0, -1);
            payload = { campus_id: temp };
            this.getSpaceFromCondition(payload);
          } else {
            console.log("1111");
            // let dataArray = this.flag.split(":");
            payload = { building_id: this.flag };
            this.getSpaceFromCondition(payload);
          }
        }
      },
      async getSpaceFromCondition(payload) {
        let queryString = "";
        Object.keys(payload).forEach((key) => {
          queryString += key + "=" + payload[key] + "&";
        });
        queryString = "?" + queryString.slice(0, -1);
        const url = "/pc/v1/rooms/getRoomByCampusOrBuilding" + queryString;
        console.log(url);
        try {
          const { data } = await axiosInstance.get(url);
          this.courseList = data.courses;
          console.log(this.courseList);
        } catch (err) {
          console.log(err);
        }
      },
      async getSpace() {
        let url = '/pc/v1/rooms';
        let Room = this.roomList;
        try {
          const { data } = await axiosInstance.get(url);
          console.log(data);
          Room = data.rooms;
          this.roomNum = Room.length;
          let roomList = [];
          let roomtypeList = [];
          let buildingList = [];
          Room.forEach((item, index) => {
            roomtypeList.push(item.room_type)
            buildingList.push(item.building_name)
            // console.log(item.room_type);
            // console.log(item.building_name);
          })
          let x = new Set(roomtypeList);
          console.log([...x]);
          this.typeNum = [...x].length;
          let y = new Set(buildingList);
          console.log([...y]);
          this.buildingNum = [...y].length;
          console.log(Room);
        } catch (error) {
          console.log(error);
        }
      },
      showDeleteConfirm(deleteList) {
        console.log(deleteList);
        deleteList.length == 0
          ? this.$message.info("请选中要删除的项")
          : this.$confirm({
            title: "确认删除吗",
            content: "数据删除后不可恢复",
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk() {
              console.log(deleteList);
              //post deleteList
            },
            onCancel() {
              console.log("Cancel");
            },
          });
      },

      //bulk import
      download() {
        let url = ""; //输入模板下载url
        window.open(url);
      },
      //上传批量导入表格
      handleChange(info) {
        this.upload_url = ""; //上传地址
        if (info.file.status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
          this.$message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === "error") {
          this.$message.error(`${info.file.name} 上传失败.`);
        }
      },
      //点击上传文件
      bulkimportSubmit() { },
    },
    mounted() {
      this.spaceList();
      this.getSpace();
    },
  };
</script>

<style scoped>
  .class-card {
    padding-left: 20px;
  }

  .container {
    padding: 10px;
    height: 100%;
  }
</style>
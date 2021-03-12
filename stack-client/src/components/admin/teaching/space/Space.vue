<template>
  <div>
    <a-row class="container">
      <a-row :span="20" style="margin: 10px 25px 20px 5px">
        <a-spin :spinning="Tree_spin_status" tip="Loading...">
          <a-tree-select
            style="width: 100%"
            :value="value"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :placeholder="orgName"
            allow-clear
            tree-default-expand-all
            @change="onChange"
          >
            <a-tree-select-node
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
        </a-spin>
      </a-row>
      <a-row>
        <a-col :span="4">
          <a-input></a-input>
        </a-col>
        <a-col :span="10"></a-col>
        <a-col :span="6">
          <a-space>
            <a-button type="primary" @click="addCampusVisible = true"
              >添加校区</a-button
            >
            <a-button type="primary" @click="addBuildingVisible = true"
              >添加建筑</a-button
            >
            <a-button type="primary" @click="addRoomVisible = true"
              >添加房间</a-button
            >
            <a-button type="primary" @click="bulkImport_visible = true"
              >批量添加{{ spaceName }}</a-button
            >
          </a-space>
        </a-col>
        <!-- <a-col :span="4">
          <a-button type="primary">
            <a-button type="primary" @click="showDeleteConfirm(checkedList)"
              >批量删除</a-button
            >
          </a-button>
        </a-col> -->
      </a-row>
      <a-row :span="20">
        <a-tabs :active-key="activeIndex" @change="callback">
          <a-tab-pane key="1" tab="建筑列表">
            <space-tree
              class="class-card"
              :buildingProp="buildingList"
            ></space-tree>
          </a-tab-pane>
          <a-tab-pane key="2" tab="房间列表" force-render>
            <a-spin :spinning="spin_status" tip="Loading...">
              <space-card
                class="class-card"
                :roomsProp="roomList"
                :buildingName="value"
              ></space-card>
            </a-spin>
          </a-tab-pane>
        </a-tabs>
      </a-row>
    </a-row>
    <!-- 添加房间 -->
    <a-modal
      v-model="addRoomVisible"
      title="添加建筑"
      @ok="submitAddRoom"
      :maskClosable="false"
    >
      <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="学校">
          {{ orgName }}
        </a-form-model-item>
        <a-form-model-item label="校区建筑">
          <a-tree-select
            :value="building_value"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :placeholder="orgName"
            allow-clear
            tree-default-expand-all
            @change="campusAndBuilding"
          >
            <a-tree-select-node
              :key="campus.campus_name"
              :title="campus.campus_name"
              v-for="campus in campusList"
              :selectable="false"
            >
              <a-tree-select-node
                :key="buildings.building_name"
                :value="{
                  campus: campus._id,
                  buildings: buildings._id,
                  building_name: buildings.building_name,
                }"
                :title="buildings.building_name"
                v-for="buildings in campus.buildings"
              >
              </a-tree-select-node>
            </a-tree-select-node>
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="房间类型">
          <a-select v-model="roomForm.room_type">
            <a-select-option
              v-for="room_type in roomTypes"
              :key="room_type"
              :value="room_type"
            >
              {{ room_type }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="房间号">
          <a-input
            placeholder="请输入房间号"
            v-model="roomForm.room_number"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 添加校区 -->
    <a-modal
      v-model="addCampusVisible"
      title="添加校区"
      @ok="submitAddCampus"
      :maskClosable="false"
    >
      <a-form-model
        :model="campusForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="campusFormRules"
      >
        <a-form-model-item label="学校名称">
          {{ orgName }}
        </a-form-model-item>
        <a-form-model-item label="校区名称" prop="campusName">
          <a-input
            placeholder="请输入校区名称"
            v-model="campusForm.campus_name"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 添加建筑 -->
    <a-modal
      v-model="addBuildingVisible"
      title="添加建筑"
      @ok="submitAddBuilding"
      :maskClosable="false"
    >
      <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="学校">
          {{ orgName }}
        </a-form-model-item>
        <a-form-model-item label="校区">
          <a-select v-model="buildingForm.campus_name">
            <a-select-option
              v-for="item in campusList"
              :key="item._id"
              :value="item._id"
            >
              {{ item.campus_name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="建筑类型">
          <a-select v-model="buildingForm.building_type">
            <a-select-option
              v-for="buildingType in buildingTypes"
              :key="buildingType.value"
              :value="buildingType.value"
            >
              {{ buildingType.key }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="建筑名">
          <a-input
            placeholder="请输入建筑名"
            v-model="buildingForm.building_name"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      v-model="bulkImport_visible"
      title="批量导入"
      @ok="bulkimportSubmit"
    >
      <a-upload
        name="file"
        :multiple="true"
        :action="upload_url"
        @change="handleChange"
      >
        <a-button type="primary"> <a-icon type="upload" /> 上传文件 </a-button>
      </a-upload>
      <br />
      <br />
      <a-button @click="download">下载模板</a-button>
    </a-modal>
  </div>
</template>

<script>
import SpaceCard from "./SpaceCard";
import SpaceTree from "./SpaceTree";
import axiosInstance from "@/utils/axios";
import { mapState } from "vuex";
export default {
  components: { SpaceCard, SpaceTree },
  data() {
    return {
      buildingTypes: [
        { key: "教学楼", value: "classroom" },
        { key: "实验楼", value: "lab" },
        { key: "办公楼", value: "office" },
        { key: "图书馆", value: "library" },
        { key: "其他", value: "others" },
      ],
      roomTypes: ["教室", "实验室", "办公室", "会议室", "报告厅", "其他"],
      // modal
      addCampusVisible: false,
      addBuildingVisible: false,
      addRoomVisible: false,
      // 规则
      campusFormRules: {
        campusName: [{ required: true, message: "校区名不能为空" }],
      },
      // 表单
      campusForm: {
        campus_name: "",
        org_name: this.orgName,
      },
      buildingForm: {
        building_name: "",
        campus_name: "",
      },
      roomForm: {
        room_number: "",
        room_type: "",
        building_name: "",
        campus_name: "",
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      value: undefined,
      building_value: undefined,
      campusList: [],
      buildingList: [],
      roomList: [],
      roomNum: 0,
      TypeList: [],
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
      Tree_spin_status: (state) => state.admin.Tree_spin_status,
      spin_status: (state) => state.admin.spin_status,
      uid: (state) => state.public.uid,
      oid: (state) => state.public.oid,
      orgName: (state) => state.public.orgName,
    }),
  },
  methods: {
    async submitAddRoom() {
      try {
        const url = `/pc/v1/rooms`;
        const requestBody = { ...this.roomForm, org_name: this.orgName };
        const data = await axiosInstance.post(url, requestBody);
        this.$message.info("添加成功");
        this.addRoomVisible = false;
        // 重新加载选择树
      } catch (err) {
        this.$message.error("添加失败");
        this.addRoomVisible = false;
        console.log(err);
      }
    },
    async submitAddCampus() {
      try {
        const url = `/pc/v1/campus`;
        const requestBody = { ...this.campusForm, org_name: this.orgName };
        const data = await axiosInstance.post(url, requestBody);
        this.$message.info("添加成功");
        this.addCampusVisible = false;
        // 重新加载选择树
        this.spaceList();
      } catch (err) {
        this.$message.error("添加失败");
        this.addCampusVisible = false;
        console.log(err);
      }
    },
    async submitAddBuilding() {
      try {
        const url = `/pc/v1/building`;
        const requestBody = { ...this.buildingForm, org_name: this.orgName };
        const data = await axiosInstance.post(url, requestBody);
        this.$message.info("添加成功");
        this.addBuildingVisible = false;
        // 重新加载选择树
        this.spaceList();
      } catch (err) {
        this.$message.error("添加失败");
        this.addBuildingVisible = false;
        console.log(err);
      }
    },
    async campusAndBuilding(params) {
      this.roomForm.building_name = params.buildings;
      this.roomForm.campus_name = params.campus;
      this.building_value = params.building_name;
    },
    async onChange(value, label) {
      this.flag = value;
      if (this.flag.slice(-1) == "#") {
        let payload = {};
        this.activeIndex = "1";
        let temp = this.flag.slice(0, -1);
        payload = { campus_id: temp };
        this.getSpaceFromCondition(payload, 1);
      } else {
        let payload = {};
        this.activeIndex = "2";
        let dataArray = this.flag.split(":");
        payload = {
          campus_id: dataArray[0],
          building_id: dataArray[1],
        };
        this.getSpaceFromCondition(payload, 2);
      }
      this.value = label;
    },
    async spaceList() {
      let queryString = "";
      const url = "/pc/v1/campus" + queryString;
      try {
        this.$store.dispatch("admin/change_Tree_spin_status", true);
        const { data } = await axiosInstance.get(url);
        this.$store.dispatch("admin/change_Tree_spin_status", false);
        this.campusList = data.data.campus;
      } catch (err) {
        console.log(err);
      }
    },
    callback(key) {
      // console.log(key);
    },
    async getSpaceFromCondition(payload, type) {
      let queryString = "";
      Object.keys(payload).forEach((key) => {
        queryString += key + "=" + payload[key] + "&";
      });

      queryString = "?" + queryString.slice(0, -1);
      const url = "/pc/v1/rooms/getRoomByCampusOrBuilding" + queryString;
      try {
        this.$store.dispatch("admin/change_spin_status", true);
        const { data } = await axiosInstance.get(url);
        console.log(
          "🚀 ~ file: Space.vue ~ line 371 ~ getSpaceFromCondition ~ data",
          data
        );
        this.$store.dispatch("admin/change_spin_status", false);
        if (type == 1) {
          this.buildingList = data.data.buildings;
          // console.log(this.buildingList);
        } else if (type == 2) {
          console.log(data.data);
          this.roomList = data.data.rooms;
        }
      } catch (err) {
        console.log(err);
      }
    },
    /*
    async getSpace() {
      let url = "/pc/v1/rooms";
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
          roomtypeList.push(item.room_type);
          buildingList.push(item.building_name);
          console.log(item.room_type);
          // console.log(item.building_name);
        });
        let x = new Set(roomtypeList);
        this.TypeList = [...x];
        console.log(this.TypeList);
        // this.typeNum = [...x].length;
        let y = new Set(buildingList);
        this.BuildingList = [...y];
        console.log([...y]);
        // this.buildingNum = [...y].length;
        console.log(Room);
      } catch (error) {
        console.log(error);
      }
    },*/
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
    bulkimportSubmit() {},
  },
  mounted() {
    //获取下拉列表数据
    this.spaceList();
    // this.getSpace();
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

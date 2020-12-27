<template>
  <div>
    <a-row class="container">
      <a-row :span="20" style="margin: 10px 25px 20px 5px;">
        <a-tree-select
          style="width: 100%"
          :value="value"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :placeholder="orgName"
          allow-clear
          tree-default-expand-all
          @change="onChange"
          @search="onSearch"
          @select="onSelect"
        >
          <a-tree-select-node
            :key="campus.campus_name"
            :value="`${campus.campus_name}#`"
            :title="campus.campus_name"
            v-for="campus in campusList"
          >
            <a-tree-select-node
              :key="buildings.name"
              :value="`${buildings.name}:${campus.campus_name}`"
              :title="buildings.name"
              v-for="buildings in campus.buildings"
            >
            </a-tree-select-node>
          </a-tree-select-node>
        </a-tree-select>
      </a-row>
      <a-row>
        <a-col> </a-col>

        <a-col>
          <a-button type="primary" @click="bulkImport_visible = true"
            >批量添加教室</a-button
          >
          <!-- <a-button type="primary">添加教室</a-button> -->
          <a-button type="primary" @click="showDeleteConfirm(checkedList)"
            >批量删除</a-button
          >
        </a-col>
      </a-row>
      <a-row :span="20">
        <a-tabs :active-key="activeIndex" @change="callback">
          <a-tab-pane key="1" tab="统计信息">
            Content of Tab Pane 1
          </a-tab-pane>
          <a-tab-pane key="2" tab="建筑房间列表" force-render>
            <space-card
              class="class-card"
              :rooms="roomList"
              :buildingName="currentBuilding"
            ></space-card>
          </a-tab-pane>
        </a-tabs>
      </a-row>
    </a-row>

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
import axiosInstance from "@/utils/axios";
import { mapState } from "vuex";
export default {
  components: { SpaceCard },
  data() {
    return {
      value: undefined,
      campusList: [],
      roomList: [],
      currentBuilding: "",
      upload_url: "",
      bulkImport_visible: false,
      colors: [
        "#9FE6B8",
        "#FFDb5C",
        "#FF9F7F",
        "#F87293",
        "#8378EA",
        "#E7bCF3",
        "#96BFFF",
      ],
      campusName: "",
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
    async onChange(data) {
      console.log("onchange:   " + data);
      this.activeIndex = "2";
      this.campusName = data;
      this.flag = data;
      this.callback("2");

      // const value = data.split(":")[0];
      // this.currentBuilding = data.split(":")[1];
      // const queryObject = {
      //   building: value,
      // };
      // let queryString = "";
      // Object.keys(queryObject).forEach((key) => {
      //   queryString += key + "=" + queryObject[key] + "&";
      // });
      // queryString = "?" + queryString.slice(0, -1);
      // const url = "/pc/v1/rooms" + queryString;

      // try {
      //   const { data } = await axiosInstance.get(url);
      //   console.log(data);
      //   this.roomList = data.rooms;
      //   console.log(this.roomList);
      // } catch (err) {
      //   console.log(err);
      // }

      this.value = this.data;
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
          payload = { subOrg_name: temp };
          // this.getCoursesFromCondition(payload);
        } else {
          console.log("1111");
          let dataArray = this.flag.split(":");
          payload = { subOrg_name: dataArray[1], major_name: dataArray[0] };
          // this.getCoursesFromCondition(payload);
        }
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
    bulkimportSubmit() {},
  },
  mounted() {
    this.spaceList();
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

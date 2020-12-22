<template>
  <div>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-row>
          <a-col :span="8" style="background: #faf9f9">
            <a-select
              default-value="请选择学院"
              size="large"
              style="width: 350px"
              @change="collegeChange"
            >
              <a-select-option
                v-for="sName in sugOrgList"
                :value="sName.subOrgName"
                :key="sName.subOrgName"
              >
                {{ sName.subOrgName }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="8" style="background: #faf9f9">
            <a-switch
              checked-children="开"
              un-checked-children="关"
              default-checked
              @change="switchChange"
            />
            <a-select
              default-value="请选择教师"
              size="large"
              style="width: 350px"
              @change="peopleChange"
              :disabled="peopleSwitch"
            >
              <a-select-option
                v-for="iTeacher in instructorList"
                :value="iTeacher.name"
                :key="iTeacher._id"
              >
                {{ iTeacher.name }} | {{ iTeacher.title }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="8" style="background: #faf9f9"> </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
        }"
      >
        <a-table :columns="columns" :data-source="resourceList">
          <!-- <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="customTitle"><a-icon type="smile-o" /> 文件名</span>
        <span slot="tags" slot-scope="tags">
          <a-tag
            v-for="tag in tags"
            :key="tag"
            :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
        <span slot="clicks" slot-scope="clicks">
          <a-tag :key="clicks" :color="clicks > 1000 ? 'green' : clicks > 10000 ? 'volcano' : 'geekblue'"></a-tag>
        </span> -->
          <span slot="action" slot-scope="text, record">
            <a>下载 一 {{ record.name }}</a>
            <a-divider type="vertical" />
            <a>删除</a>
          </span>
        </a-table>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
const columns = [
  {
    title: "文件名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "上传者",
    dataIndex: "authorId.name",
    key: "authorId.name",
  },
  {
    title: "大小",
    dataIndex: "size",
    key: "size",
  },
  {
    title: "类型",
    dataIndex: "rsType",
    key: "rsType",
  },
  {
    title: "标签",
    key: "tags",
    dataIndex: "tags",
    scopedSlots: { customRender: "tags" },
  },
  {
    title: "下载次数",
    key: "click",
    dataIndex: "click",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];

const data = [
  {
    name: "二元一次方程",
    authorName: "张汇泉",
    size: 345,
    fileType: "mp4",
    clicks: 999,
    tags: ["nice", "developer"],
  },
  {
    name: "操作系统",
    authorName: "祁超",
    size: 1024,
    fileType: "pdf",
    clicks: 1230,
    tags: ["loser"],
  },
  {
    name: "高级数据结构",
    authorName: "郭敏",
    size: 10246,
    fileType: "doc",
    clicks: 23500,
    tags: ["cool", "teacher"],
  },
];

import axiosInstance from "../../../utils/axios.js";
export default {
  data() {
    return {
      size: "default",
      sugOrgList: [],
      instructorList: [],
      resourceList: [],
      serverOutput: [],
      data,
      columns,
      peopleSwitch: false,
      currentCollege: "",
      currentTeacher: "",
    };
  },
  methods: {
    collegeChange(value) {
      console.log(`Selected: ${value}`);
      // if switch close, just check resource of college
      this.currentCollege = value;
      //if switch open, do NOTHING
      this.getTeacherName(value);
    },
    peopleChange(value) {
      console.log(`Selected: ${value}`);
      this.currentTeacher = value;
      //if switch open, check out resource of people in college
      this.getResources(this.currentCollege, value);
    },
    switchChange(checked) {
      console.log(`a-switch to ${checked}`);
      if (checked) {
        // open switch
        this.peopleSwitch = false;
      } else {
        //close switch
        this.peopleSwitch = true;
      }
    },
    async getSubOrgsName() {
      const orgId = "5facabb2cf3bb2002b4b3f38";
      const url = "/pc/v1/organizations/" + orgId + "/suborgs";
      try {
        const { data } = await axiosInstance.get(url);
        this.sugOrgList = data.subOrgs;
      } catch (err) {
        console.log(err);
      }
    },
    async getTeacherName(value) {
      console.log(value);
      // const orgId="5facabb2cf3bb2002b4b3f38"
      const queryObject = {
        org_name: "陕西师范大学",
        subOrg_name: value,
        role: "teacher",
      };
      let queryString = "";
      Object.keys(queryObject).forEach((key) => {
        queryString += key + "=" + queryObject[key] + "&";
      });
      queryString = "?" + queryString.slice(0, -1);
      const url = "/pc/v1/users/multipleUsers" + queryString;
      console.log(url);
      try {
        const { data } = await axiosInstance.get(url);
        this.instructorList = data.teachers;
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    },
    async getResources(college, value) {
      console.log(value);
      const queryObject = {
        org_name: "陕西师范大学",
        subOrg_name: college,
        authorId: "26052730-3dbc-11eb-8646-0f45281ed99c",
      };
      let queryString = "";
      Object.keys(queryObject).forEach((key) => {
        queryString += key + "=" + queryObject[key] + "&";
      });
      queryString = "?" + queryString.slice(0, -1);
      const url = "/pc/v1/resources" + queryString;

      try {
        const { data } = await axiosInstance.get(url);
        this.resourceList = data.resources;
        console.log(this.resourceList);
      } catch (err) {
        console.log(err);
      }
    },
    // sendMessage(value){
    //   socketInstance.sendEvent({type:'vote',data:{vote:"this is a test"}})
    // }
  },
  created: function() {},
  mounted() {
    this.getSubOrgsName();
    this.getTeacherName();

    // socketio.addEventListener({
    //   type: "message",
    //   callback: (message) => {
    //     console.log(message);
    //   },
    // });
  },
};
</script>

<style>
.temp {
  display: flex;
  flex-direction: column;
}
.college {
}
</style>

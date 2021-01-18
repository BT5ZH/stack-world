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
                :value="iTeacher._id"
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
import { mapState } from "vuex";
export default {
  data() {
    return {
      size: "default",
      sugOrgList: [],
      instructorList: [],
      resourceList: [],
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
      //this.getTeacherName(this.currentCollege);
      this.getResourcesOfSubOrg(this.currentCollege)
    },
    peopleChange(value) {
      console.log(`Selected: ${value}`);
      this.currentTeacher = value;
      //if switch open, check out resource of people in college
      this.getResources(this.currentCollege, this.currentTeacher);
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
    getResourcesOfSubOrg(subOrgName){
       this.$store.dispatch("admin/getResourcesOfOneCollege", 
       {
         org_name:this.org_name,
         subOrg_name:subOrgName
       })
       .then(res => {
          this.resourceList = res.data.allResources;
           console.log("this.resourceList99999999999999999999" );
          console.log(this.resourceList);
        })
        .catch(err=>{
          console.log(err);
        })
    },
    async getSubOrgsName() {
      const orgId = this.oid;///////////////
      const url = "/pc/v1/organizations/" + orgId + "/suborgs";
      try {
        const { data } = await axiosInstance.get(url);
        this.sugOrgList = data.subOrgs;
      } catch (err) {
        console.log(err);
      }
    },
    async getTeacherName(subOrgName) {
      // const orgId="5facabb2cf3bb2002b4b3f38"
      const queryObject = {
        org_name: this.org_name,
        subOrg_name: subOrgName,
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
    async getResources(college, teacher) {
     
      const queryObject = {
        //org_name: this.org_name,
        //subOrg_name: college,
        authorId: teacher,////////////////////////////
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
  },
  computed: {
    ...mapState({
      oid: (state) => state.public.oid,
      uid: (state) => state.public.uid,
      org_name:(state)=>state.public.org_name,
    }),
  },
  created: function() {},
  mounted() {
    this.getSubOrgsName();
    this.getTeacherName();
    this.$store.dispatch("public/getOrgnizationName", this.oid);
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

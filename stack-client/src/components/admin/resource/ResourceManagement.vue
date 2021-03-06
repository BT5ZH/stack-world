<template>
  <div>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-row>
          <a-col :span="12" style="background: #faf9f9">
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
            <!-- <a-switch
              checked-children="开"
              un-checked-children="关"
              default-checked
              @change="switchChange"
            /> -->
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
        <!-- <a-table :columns="columns" :data-source="resourceList"> -->
        <a-table
          :pagination="{
            total: resourceList.length,
            //pageSizeOptions: pageSize,
            pageSize: 5,
            'show-less-items': true,
            'show-size-changer': true,
            'show-quick-jumper': true,
            'hide-on-single-page': true,
          }"
          :bordered="true"
          :columns="columns"
          :data-source="resourceList"
        >
          <span slot="action" slot-scope="text, record">
            <!-- <a>下载 一 {{ record.name }}</a> -->
            <a @click="download(record)">下载</a>
            <a-divider type="vertical" />
            <a
              @click="deleteResource(record._id)"
              v-show="isShowDeleteButton === 'yes'"
              >删除</a
            >
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
    key: "_id",
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
  // {
  //   name: "二元一次方程",
  //   authorName: "张汇泉",
  //   size: 345,
  //   fileType: "mp4",
  //   clicks: 999,
  //   tags: ["nice", "developer"],
  // },
  // {
  //   name: "操作系统",
  //   authorName: "祁超",
  //   size: 1024,
  //   fileType: "pdf",
  //   clicks: 1230,
  //   tags: ["loser"],
  // },
  // {
  //   name: "高级数据结构",
  //   authorName: "郭敏",
  //   size: 10246,
  //   fileType: "doc",
  //   clicks: 23500,
  //   tags: ["cool", "teacher"],
  // },
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
      refresh: 0,
      isShowDeleteButton: "yes1",
      //pageSize: ["10", "20", "30", "50", "100"],
    };
  },
  watch: {
    refresh(val) {
      this.getResources(this.currentCollege, this.currentTeacher);
    },
  },
  methods: {
    collegeChange(value) {
      console.log(`Selected: ${value}`);
      // if switch close, just check resource of college
      this.currentCollege = value;
      this.isShowDeleteButton = "no";
      //if switch open, do NOTHING
      this.getTeacherName(this.currentCollege);
      this.getResourcesOfSubOrg(this.currentCollege);
    },
    peopleChange(value) {
      console.log(`Selected: ${value}`);
      this.currentTeacher = value;
      this.isShowDeleteButton = "yes";
      //if switch open, check out resource of people in college
      this.getResources(this.currentCollege, this.currentTeacher);
    },
    // deleteResource(resourceId) {
    //   var that = this
    //   if(confirm("是否确认要删除？")) {
    //     this.$store.dispatch("admin/deleteResourceById", resourceId)
    //     .then(res => {
    //          console.log(`res------:${res}`)
    //         that.refresh+=1
    //     })
    //     .catch(err=>{
    //        console.log(err);
    //     })
    //   }
    // },
    deleteResource(resourceId) {
      const that = this;
      this.$confirm({
        title: "确定删除此资源吗?",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          try {
            that.$store
              .dispatch("admin/deleteResourceById", resourceId)
              .then((res) => {
                console.log(`res------:${res}`);
                that.refresh += 1;
              })
              .catch((err) => {
                console.log(err);
              });
          } catch (err) {
            console.log(err);
          }
        },
        onCancel() {
          // console.log("Cancel");
        },
      });
    },
    download(source) {
      // setTimeout(() => {
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = source.name;
      a.target = "_blank";
      a.href = source.url;
      a.dispatchEvent(event);
      // }, 1000);
    },
    // switchChange(checked) {
    //   console.log(`a-switch to ${checked}`);
    //   if (checked) {
    //     // open switch
    //     this.peopleSwitch = false;
    //   } else {
    //     //close switch
    //     this.peopleSwitch = true;
    //   }
    // },
    getResourcesOfSubOrg(subOrgName) {
      this.$store
        .dispatch("admin/getResourcesOfOneCollege", {
          org_name: this.org_name,
          subOrg_name: subOrgName,
        })
        .then((res) => {
          this.resourceList = res.data.allResources;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // async
    getSubOrgsName() {
      const orgId = this.oid; ///////////////
      const url = "/pc/v1/organizations/" + orgId + "/suborgs";
      this.$store
        .dispatch("admin/getTreeByURLwithSpin", url)
        .then((response) => {
          // console.log(response);
          this.sugOrgList = response.data.subOrgs;
        })
        .catch((error) => {
          console.log(error);
        });
      // try {
      //   const { data } = await axiosInstance.get(url);
      //   console.log("---------1----------------");
      //   console.log(data);

      //   this.sugOrgList = data.subOrgs;
      // } catch (err) {
      //   console.log(err);
      // }
    },
    // async
    getTeacherName(subOrgName) {
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
      // console.log(url);
      this.$store
        .dispatch("admin/getTreeByURLwithSpin", url)
        .then((response) => {
          // console.log(response);
          this.instructorList = response.data.teachers;
        })
        .catch((error) => {
          console.log(error);
        });
      // try {
      //   const { data } = await axiosInstance.get(url);
      //   this.instructorList = data.teachers;
      //   console.log("---------2----------------");

      //   console.log(data);
      // } catch (err) {
      //   console.log(err);
      // }
    },
    async getAllresources() {
      this.$store
        .dispatch("admin/getAllResources")
        .then((response) => {
          this.resourceList = response.data.resources;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getResources(college, teacher) {
      const queryObject = {
        //org_name: this.org_name,
        //subOrg_name: college,
        authorId: teacher, ////////////////////////////
      };
      let queryString = "";
      Object.keys(queryObject).forEach((key) => {
        queryString += key + "=" + queryObject[key] + "&";
      });
      queryString = "?" + queryString.slice(0, -1);
      const url = "/pc/v1/resources" + queryString;
      this.$store
        .dispatch("admin/getTreeByURL", url)
        .then((response) => {
          // console.log("---------");
          // console.log(response);
          this.resourceList = response.data.resources;
        })
        .catch((error) => {
          console.log(error);
        });
      // try {
      //   const { data } = await axiosInstance.get(url);
      //   this.resourceList = data.resources;
      //   console.log(this.resourceList);
      // } catch (err) {
      //   console.log(err);
      // }
    },
  },
  computed: {
    ...mapState({
      oid: (state) => state.public.oid,
      uid: (state) => state.public.uid,
      org_name: (state) => state.public.orgName,
    }),
  },
  created: function () {},
  mounted() {
    this.getAllresources();
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

<template>
  <div>
    <h1>资源管理</h1>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-row>
          <a-col  :span="8" style="background: #2d5a88">
            <a-select default-value="请选择学院" size="large" style="width: 350px" @change="collegeChange">
                <a-select-option v-for="sName in sugOrgList" :value="sName.subOrgName" :key="sName.subOrgName">
                  {{sName.subOrgName}}
                </a-select-option>
              </a-select>
            
          </a-col>
          <a-col :span="8" style="background: #a6a8e9">
            <a-switch checked-children="开" un-checked-children="关" default-checked @change="switchChange"/>
            <a-select default-value="请选择教师" size="large" style="width: 350px" @change="peopleChange" :disabled="peopleSwitch">
              <a-select-option v-for="iTeacher in instructorList" :value="iTeacher.name" :key="iTeacher._id">
                {{iTeacher.name}} | {{iTeacher.title}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="8">
            col-8
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
      <a-table :columns="columns" :data-source="data">
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
        <span slot="tags" slot-scope="tags">
          <a-tag
            v-for="tag in tags"
            :key="tag"
            :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a>Invite 一 {{ record.name }}</a>
          <a-divider type="vertical" />
          <a>Delete</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link"> More actions <a-icon type="down" /> </a>
        </span>
      </a-table>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' },
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    scopedSlots: { customRender: 'tags' },
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];
import axiosInstance from "../../../utils/axios.js"
export default {
  data() {
    return {
      size: 'default',
      sugOrgList:[],
      instructorList:[],
      data,
      columns,
      peopleSwitch:false
    };
  },
  methods: {
    collegeChange(value) {
      console.log(`Selected: ${value}`);
      // if switch close, just check resource of college

      //if switch open, do NOTHING
      this.getTeacherName(value)
    },
    peopleChange(value) {
      console.log(`Selected: ${value}`);
      //if switch open, check out resource of people in college
    },
    switchChange(checked){
      console.log(`a-switch to ${checked}`);
      if(checked){
        // open switch 
        this.peopleSwitch=false
      }else{
        //close switch
        this.peopleSwitch=true
      }
    },
    async getSubOrgsName(){
      const orgId="5facabb2cf3bb2002b4b3f38"
      const url="/pc/v1/organizations/"+orgId+"/suborgs";
      try{
        const {data}= await axiosInstance.get(url);
        this.sugOrgList = data.subOrgs;
      }catch(err){
        console.log(err)
      }
    },
    async getTeacherName(value){
      console.log(value)
      // const orgId="5facabb2cf3bb2002b4b3f38"
      const queryObject = {"org_name":"陕西师范大学","subOrg_name":value,"role":"teacher"};
      let queryString = "";
      Object.keys(queryObject).forEach(key => {
        queryString+= key+"="+queryObject[key]+"&"
      });
      queryString="?"+queryString.slice(0,-1)
      const url="/pc/v1/users/multipleUsers"+queryString;
      console.log(url);
      try{
        const {data}= await axiosInstance.get(url);
        this.instructorList=data.teachers;
        console.log(data);
      }catch(err){
        console.log(err)
      }
    }
  },
  created: function () {
    
  },
  mounted(){
    this.getSubOrgsName();
    this.getTeacherName();
  }
};
</script>

<style>
.temp{
  display: flex;
  flex-direction: column;
}
.college{

}
</style>
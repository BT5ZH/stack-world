<template>
<div>
    <a-col :span="3"  :order="1"></a-col>
    <a-col :span="18" :order="2">

  <div>
 
    <br>
    <br>
  <a-row>
    <a-col :span="3">
      <h2>往期作业列表</h2>
    </a-col>
    <a-col :span="15">
      <ul class="menu" @click="tabChange">
        <li
          v-for="menu in menus"
          :key="menu.id"
          :class="{ 'menu-active': currentMenu === menu.id }"
          :id="menu.id"
        >
          {{ menu.name }}
        </li>
      </ul>
    </a-col>
    <a-col :span="6">
      <span>{{ teacher_name }}（教师）</span>
    </a-col>
  </a-row>
  
  </div>
  <br>
  <br>
 
  <div>
 <a-table :columns="columns" :data-source="data">
    <a slot="name" slot-scope="text">{{ text }}</a>
    <span slot="customTitle">作业名称</span>
    <span slot="End" slot-scope="End">
      <a-tag
        v-for="tag in End"
        :key="tag"
        :color="tag === 'green'"
      >
        {{ tag.toUpperCase() }}
      </a-tag>
    </span>
    <span slot="action" >
      <a @click="CorrectPage">进入</a>
      
    </span>
  </a-table>
   </div>
 
    

    </a-col>
<a-col :span="3"></a-col>
</div>
</template>

<script>
const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle' },
    
  },

  {
    title: '发布时间',
    dataIndex: 'Releasetime',
    key: 'Releasetime',
  },
  {
    title: '结束时间',
    key: 'End',
    dataIndex: 'End',
   
  },
  {
    title: '批阅',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
const data = [
  {
    key: '1',
    name: '进程单元测试',
    Releasetime: '2020-10-20',
    End:'2020-10-28',
  },
  {
    key: '2',
    name: '作业二',
    Releasetime: '2020-10-20',
    End: '2020-10-20',
  },
  {
    key: '3',
    name: '作业三',
    Releasetime: '2020-05-25',
    End: '2020-05-30',
  },
];



export default {
  data() {
    return {
      data,
      columns,
      currentMenu: "teacher_index",
      teacher_name: "李师",
      menus: [
        { name: "首页", id: "teacher_index" },
        { name: "返回", id: "teacher_course" },
      
      ],
     
    };
    
  
  },
  methods: {
   

    tabChange({ target }) {
      const key = target.id;
      if (this.$route.name !== key) {
        this.currentMenu = key;
        this.$router.push({ name: key });
      }
    },
     CorrectPage(){
      this.$router.push('/CorrectPage')
    
  },
  },

};
</script>

<style>
.class{
  background-color: rgb(140, 178, 247);
}
.el-header{
  background-color: rgb(127, 168, 245);
}
.menu {
  list-style: none;
}
.menu li {
  display: inline;
  margin-right: 10%;
  cursor: pointer;
}
.menu li:hover,
.menu-active {
  color: #409eff;
}

</style>
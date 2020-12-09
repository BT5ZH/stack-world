<template>
  <div>
    <h1>资源管理</h1>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-row>
          <a-col :span="8" style="background: #2d5a88">
            <a-select default-value="请选择学院" size="large" style="width: 350px" @change="handleChange">
              <a-select-option v-for="sName in sugOrgList" :value="sName" :key="sName">
                {{sName}}
              </a-select-option>
            </a-select>
            
          </a-col>
          <a-col :span="8" style="background: #a6a8e9">
            <a-select default-value="请选择教师" size="large" style="width: 350px" @change="handleChange">
              <a-select-option v-for="iTeacher in instructorList" :value="iTeacher.orgId" :key="iTeacher.orgId">
                {{iTeacher.userName}}({{iTeacher.title}})
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
export default {
  data() {
    return {
      size: 'default',
      sugOrgList:[
        "马克思主义学院",
        "哲学与政府管理学院",
        "文学院",
        "教育学院（田家炳教育书院）",
        "心理学院",
        "外国语学院",
        "数学与信息科学学院",
        "物理学与信息技术学院",
        "化学化工学院",
        "材料科学与工程学院",
        "生命科学学院",
        "地理科学与旅游学院",
        "计算机科学学院",
        "新闻与传播学院",
        "体育学院",
        "音乐学院",
        "美术学院",
        "国际商学院",
        "国际汉学院",
        "食品工程与营养科学学院",
        "哲学书院",
        "民族教育学院",
        "基础实验教学中心",
        "教师干部教育学院",
        "远程教育学院"
      ],
      instructorList:[
        {orgId:"1998123", userName:"李永明",title:"教授"},
        {orgId:"1998124", userName:"王小明",title:"教授"},
        {orgId:"1998125", userName:"曹菡",title:"教授"},
        {orgId:"1998126", userName:"汪西莉",title:"教授"},
      ],
      data,
      columns,
    };
  },
  methods: {
    handleChange(value) {
      console.log(`Selected: ${value}`);
    },
    popupScroll() {
      console.log('popupScroll');
    }
  },
  mounted:{

  }
};
</script>

<style>

</style>
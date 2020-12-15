<template>
  <a-table :columns="columns" :data-source="data">
    <a slot="num" slot-scope="text">{{ text }}</a>
    <span slot="customTitle"> 序号</span>
    <span slot="tags" slot-scope="tags">
      <a-tag
        v-for="tag in tags"
        :key="tag"
        :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
      >
        {{ tag.toUpperCase() }}
      </a-tag>
    </span>
    <span slot="action" >
      <a>学生详情</a>
      <a-divider type="vertical" />
      <a @click="homework">批改作业</a>
      
    </span>
  </a-table>
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
    title: '班级名称',
    dataIndex: 'num',
    key: '班级名称',
  },
  {
    title: '人数',
    dataIndex: 'address',
    key: '人数',
  },
  {
    title: '上课时间',
    key: '上课时间',
    dataIndex: 'tags',
   
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];

const data = [
  {
    key: '1',
    name: '1',
    num:'软件1班',
    address: '32',
    tags: ['2020-2021 第二学期周四1~2节'],
  },
  {
    key: '2',
    name: '2',
    num:'软件2班',
    address: '38',
    tags: ['2020-10-20'],
  },
  {
    key: '3',
    name: '3',
    num: '计创1班',
    address: '40',
    tags: ['2020-10-20'],
  },
];

export default {
  data() {
    return {
      data,
      columns,
    };
  },
  methods:{

    homework(){
      this.$router.push('/homework')

    },
  },
};
</script>

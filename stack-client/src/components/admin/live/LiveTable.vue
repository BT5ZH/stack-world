<template>
  <div class="area">
    <a-row >
      <a-col>
        <a-button-group>
          <a-button type="primary">分辨率设置</a-button>
          <a-button>直播任务设置</a-button>
        </a-button-group>
      </a-col>
    </a-row>
    <a-row class="btn">
      <a-col :span="20"></a-col>
      <a-col :span="4">
        <a-button type="primary">新增直播任务</a-button>
      </a-col>
    </a-row>
    <a-table 
      class="tb"
      rowKey="_id" 
      :pagination="{
        total: 50,
        'show-size-changer': true,
        'show-quick-jumper': true,
      }" 
      :bordered="true" 
      :columns="columns" 
      :data-source="liveclassroomList">
       <a-template slot="operation">
        <a-button type="link">编辑</a-button>
        <a-button type="link">删除</a-button>
       </a-template>
    </a-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns: [
          {
            title: "序号",
            dataIndex: "_id",
            align: "center",
          },
          {
            title: "任务名称",
            dataIndex: "taskName",
            align: "center",
          },
          {
            title: "开始时间",
            dataIndex: "startTime",
            align: "center",
          },
          {
            title: "结束时间",
            dataIndex: "finishTime",
            align: "center",
          },
          {
            title: "接收教室（数量）",
            dataIndex: "roomNum",
            align: "center",
          },
          {
            title: "接收学生（数量）",
            dataIndex: "studentNum",
            align: "center",
          },
          {
            title: "操作",
            align: "center",
            scopedSlots: { customRender: "operation" },
          },
        ],
        selectedLiveClassrooms:[],
        liveclassroomList: [
          {
            _id: "1",
            taskName: "大学图书馆使用规范",
            startTime: "2020-10-10 08:00:00",
            finishTime: "2020-10-10 08:00:00",
            roomNum: 12,
            studentNum: 48,
          },
          {
            _id: "2",
            taskName: "陕师大雁塔校区教学交楼使用规范",
            startTime: "2020-10-10 08:00:00",
            finishTime: "2020-10-10 08:00:00",
            roomNum: 12,
            studentNum: 48,
          },
          {
            _id: "3",
            taskName: "陕师大长安校区逸夫科技楼使用规范",
            startTime: "2020-10-10 08:00:00",
            finishTime: "2020-10-10 08:00:00",
            roomNum: 12,
            studentNum: 48,
          }
        ]
      };
    },
  }
</script>

<style>
.area {
  padding-top: 20px;
  padding-left: 10px;
}

.btn {
  padding-top: 10px;
  padding-bottom: 10px;
}
.tb {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
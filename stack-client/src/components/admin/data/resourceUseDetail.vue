<template>
  <div>
    <div class="menu-header">
      <a-menu mode="horizontal" @select="handleClick">
        <a-menu-item key="log">设备日志</a-menu-item>
        <a-menu-item key="activity">课程活动</a-menu-item>
        <a-menu-item key="resource">资源使用数据</a-menu-item>
      </a-menu>
    </div>
    <div class="other">
      <a-row>
        <a-col :span="16">
          <a-range-picker
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :placeholder="['开始时间', '结束时间']"
            @change="onChange"
            @ok="onOk"
          />
          <a-input
            style="width: 200px;margin-left:10px;"
            placeholder="资源名称"
            v-model="checkInfo.resource"
          />
          <a-button style="width: 10%; margin-left:10px;" @click="check">查询</a-button>
        </a-col>
        <a-col :span="8" :push="5">
          <a-button type="primary" @click="exportData">导出当前数据</a-button>
        </a-col>
      </a-row>
      <a-table
        :columns="columns"
        :data-source="dataList"
        bordered
        style="margin-top:10px"
        rowKey="id"
      >
        <template slot="operation" slot-scope="text, record">
          <a-button type="link" @click="showDetails(record.key)">详情</a-button>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
const columns = [
  {
    title: "序号",
    align: "center",
    dataIndex: "id",
  },
  {
    title: "资源名称",
    align: "center",
    dataIndex: "resource",
  },
  {
    title: "类型",
    align: "center",
    dataIndex: "type",
  },
  {
    title: "下载次数",
    align: "center",
    dataIndex: "download",
  },
  {
    title: "收藏次数",
    align: "center",
    dataIndex: "collect",
  },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "operation" },
  },
];

const dataList = [
  {
    id: "1",
    resource: "论语导读.doc",
    type: "课件",
    download: 35,
    collect: 12,
  },
  {
    id: "2",
    resource: "化工基础",
    type: "试卷",
    download: 14,
    collect: 3,
  },
];

export default {
  data() {
    return {
      columns,
      dataList,
      checkInfo: {
        startTime: "",
        endTime: "",
        resource: "",
      },
    };
  },
  methods: {
    handleClick(e) {
      console.log(e.key);
    },
    onChange(value, dateString) {
      // console.log("Selected Time: ", value);
      // console.log("Formatted Selected Time: ", dateString);
      this.checkInfo.startTime = dateString[0];
      this.checkInfo.endTime = dateString[1];
    },
    onOk(value) {
      console.log("onOk: ", value);
    },
    check() {
      console.log("查询数据");
      console.log(this.checkInfo);
    },
    exportData() {
      console.log("导出数据");
    },
    showDetails(key) {
      console.log("输出详情");
      console.log(key);
    },
  },
};
</script>

<style>
.menu-header {
  margin: 10px;
}
.other {
  margin: 10px;
}
</style>
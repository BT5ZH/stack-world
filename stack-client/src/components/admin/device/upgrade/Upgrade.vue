<template>
  <a-row class="container">
    <a-col :span="4">
      <a-tree
        :show-line="showLine"
        :default-expanded-keys="['0-0-0', '0-0-1', '0-0-2']"
        @select="onSelect"
      >
        <a-icon slot="icon" type="carry-out" />
        <a-tree-node key="0-0">
          <a-icon slot="icon" type="carry-out" />
          <span slot="title" style="color: #1890ff">育人学校（61）</span>
          <a-tree-node key="0-0-0" title="主楼（20）">
            <a-icon slot="icon" type="carry-out" />
            <a-tree-node key="0-0-0-0" title="1层（11）">
              <a-icon slot="icon" type="carry-out" />
              <a-tree-node key="0-0-0-0-1" title="1001"> </a-tree-node>
              <a-tree-node key="0-0-0-0-2" title="1002"> </a-tree-node>
              <a-tree-node key="0-0-0-0-3" title="1003"> </a-tree-node>
              <a-tree-node key="0-0-0-0-4" title="1004"> </a-tree-node>
            </a-tree-node>
            <a-tree-node key="0-0-0-1" title="2层（2）">
              <a-icon slot="icon" type="carry-out" />
              <a-tree-node key="0-0-0-1-1" title="2001"> </a-tree-node>
              <a-tree-node key="0-0-0-1-3" title="2003"> </a-tree-node>
            </a-tree-node>
            <a-tree-node key="0-0-0-2" title="5层（7）">
              <a-icon slot="icon" type="carry-out" />
            </a-tree-node>
          </a-tree-node>
          <a-tree-node key="0-0-1" title="生化楼（22）">
            <a-icon slot="icon" type="carry-out" />
            <a-tree-node key="0-0-1-0" title="1层（10）">
              <a-icon slot="icon" type="carry-out" />
            </a-tree-node>
            <a-tree-node key="0-0-1-1" title="1层（12）">
              <a-icon slot="icon" type="carry-out" />
            </a-tree-node>
          </a-tree-node>
          <a-tree-node key="0-0-2" title="多媒体微机室（12）">
            <a-icon slot="icon" type="carry-out" />
            <a-tree-node key="0-0-2-0" title="3层（10）">
              <a-icon slot="icon" type="carry-out" />
            </a-tree-node>
            <a-tree-node key="0-0-2-1" title="4层（2）">
              <a-icon slot="icon" type="carry-out" />
            </a-tree-node>
          </a-tree-node>
        </a-tree-node>
      </a-tree>
    </a-col>
    <a-col :span="20">
      <a-row class="btn-area">
        <a-col style="float: left"> 升级进度： </a-col>
        <a-col style="width: 200px; float: left">
          <a-progress :percent="30" size="small" status="active" />
        </a-col>
        <a-col style="float: right">
          <a-select
            default-value="lucy"
            :style="{ width: '250px' }"
            @change="handleChange"
          >
            <a-select-option value="jack">
              UpgradePack-2020-11-1.zip
            </a-select-option>
            <a-select-option value="lucy">
              UpgradePack-2020-11-11.zip
            </a-select-option>
            <a-select-option value="Yiminghe">
              UpgradePack-2020-11-29.zip
            </a-select-option>
          </a-select>
          <a-button type="primary">升级</a-button>
        </a-col>
      </a-row>
      <a-table
        rowKey="_id"
        :pagination="{
          total: 50,
          'show-size-changer': true,
          'show-quick-jumper': true,
        }"
        :bordered="true"
        :row-selection="{
          selectedRowKeys: selectedCourses,
          onChange: onSelectChange,
        }"
        :columns="columns"
        :data-source="courseList"
      >
        <template v-slot:operation>
          <a-button type="link">下载</a-button>
        </template>
      </a-table>
    </a-col>
  </a-row>
</template>

<script>
export default {
  data() {
    return {
      showLine: true,
      current: ["mail"],
      openKeys: ["sub1"],
      columns: [
        {
          title: "序号",
          dataIndex: "_id",
          align: "center",
        },
        {
          title: "MAC",
          dataIndex: "mac_id",
          align: "center",
        },
        {
          title: "在线",
          dataIndex: "online",
          align: "center",
        },
        {
          title: "设备类型",
          dataIndex: "depart_name",
          align: "center",
        },
        {
          title: "IP地址",
          dataIndex: "ip_addr",
          align: "center",
        },
        {
          title: "设备位置",
          dataIndex: "depart_addr",
          align: "center",
        },
        {
          title: "当前软件版本",
          dataIndex: "version",
          align: "center",
        },
        {
          title: "升级后软件版本",
          dataIndex: "upgrade_version",
          align: "center",
        },
        {
          title: "当前固件版本",
          dataIndex: "firmware_version",
          align: "center",
        },
        {
          title: "升级后固件版本",
          dataIndex: "upgrade_fm_ver",
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "state",
          align: "center",
        },
        {
          title: "日志",
          align: "center",
          scopedSlots: { customRender: "operation" },
        },
      ],
      selectedCourses: [],
      courseList: [
        {
          _id: "1",
          mac_id: "00:0A:35;2C;71:A1",
          online: "是",
          depart_name: "小栈",
          ip_addr: "192.168.188.10",
          depart_addr: "主楼-3-0315",
          version: "V1.0.0 2020-11-1",
          upgrade_version: "V1.0.1 2020-11-10",
          firmware_version: "1.0",
          upgrade_fm_ver: "1.0",
          state: "升级中",
        },
        {
          _id: "2",
          mac_id: "00:0A:35;2C;71:A2",
          online: "是",
          depart_name: "小栈",
          ip_addr: "192.168.188.11",
          depart_addr: "逸夫楼-4-1203",
          version: "V1.0.0 2020-11-1",
          upgrade_version: "V1.0.1 2020-11-11",
          firmware_version: "1.0",
          upgrade_fm_ver: "1.0",
          state: "升级完成",
        },
        {
          _id: "3",
          mac_id: "00:0A:35;2C;71:A3",
          online: "否",
          depart_name: "小栈",
          ip_addr: "192.168.188.12",
          depart_addr: "图书馆-4-402",
          version: "V1.0.0 2020-11-1",
          upgrade_version: "V1.0.1 2020-11-12",
          firmware_version: "1.0",
          upgrade_fm_ver: "1.0",
          state: "升级失败",
        },
        {
          _id: "4",
          mac_id: "00:0A:35;2C;71:A4",
          online: "否",
          depart_name: "小栈",
          ip_addr: "192.168.188.13",
          depart_addr: "图书馆-5-501",
          version: "V1.0.0 2020-11-1",
          upgrade_version: "V1.0.1 2020-11-13",
          firmware_version: "1.0",
          upgrade_fm_ver: "1.0",
          state: "升级失败",
        },
      ],
    };
  },
  watch: {
    openKeys(val) {
      console.log("openKeys", val);
    },
  },
  methods: {
    handleClick(e) {
      console.log("click", e);
    },
    titleClick(e) {
      console.log("titleClick", e);
    },
    onSelectChange(selectedKeys) {
      this.selectedCourses = selectedKeys;
    },
    onSelect(selectedKeys, info) {
      console.log("selected", selectedKeys, info);
    },
    onSearch() {},
    handleChange() {},
  },
};
</script>

<style scoped>
.btn-area {
  padding-bottom: 10px;
}

.btn .ant-btn {
  margin: 0 5px;
}
.container {
  padding: 20px;
}
</style>

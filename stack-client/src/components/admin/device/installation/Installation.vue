<template>
  <a-layout id="components-layout-demo-fixed">
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <a-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['2']"
        :style="{ lineHeight: '64px' }"
      >
      </a-menu>
    </a-layout-header>
    <a-layout-content :style="{ padding: '0 10px', marginTop: '64px' }">
      <a-breadcrumb :style="{ margin: '16px 0' }">
        <a-breadcrumb-item>设备安装页面</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '30px' }">
        <a-select default-value="lucy" style="width: 120px" @change="handleChange">
          <a-select-option value="jack">
            全部教学楼
          </a-select-option>
          <a-select-option value="lucy">
            主楼
          </a-select-option>
          <a-select-option value="Tom">
            生化楼
          </a-select-option>
          <a-select-option value="Yimi">
            多媒体微机室
          </a-select-option>
          <a-select-option value="Gili">
            三教
          </a-select-option>
        </a-select>
        <a-input-search
          placeholder="mac/设备ID"
          enter-button="查询"
          style="width: 250px"
          @search="onSearch"
        />
      </div>
      <template>
  <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" bordered>
    <template
      v-for="col in ['MAC', '设备名称', '设备ID','IP地址','位置','状态','操作']"
      :slot="col"
      slot-scope="text, record"
    >
      <div :key="col">
        <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="e => handleChange(e.target.value, record.key, col)"
        />
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>
    <template slot="操作" slot-scope="text, record">
      <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.key)">确定</a>
          <a-popconfirm title="确定要取消?" @confirm="() => cancel(record.key)">
            <a>取消</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a>
        </span>
      </div>
    </template>
  </a-table>
  </template>
    </a-layout-content>
  </a-layout>
</template>

<script>
const columns = [
  {
    title: 'MAC',
    dataIndex: 'MAC',
    width: '15%',
    align: "center",
    scopedSlots: { customRender: 'MAC' },
  },
  {
    title: '设备名称',
    dataIndex: '设备名称',
    width: '10%',
    align: "center",
    scopedSlots: { customRender: '设备名称' },
  },
  {
    title: '设备ID',
    dataIndex: '设备ID',
    width: '15%',
    align: "center",
    scopedSlots: { customRender: '设备ID' },
  },
  {
    title: 'IP地址',
    dataIndex: 'IP地址',
    width: '15%',
    align: "center",
    scopedSlots: { customRender: 'IP地址' },
  },
  {
    title: '位置',
    dataIndex: '位置',
    width: '15%',
    align: "center",
    scopedSlots: { customRender: '位置' },
  },
  {
    title: '状态',
    dataIndex: '状态',
    width: '15%',
    align: "center",
    scopedSlots: { customRender: '状态' },
  },
  {
    title: '操作',
    dataIndex: '操作',
    align: "center",
    scopedSlots: { customRender: '操作' },
  },
];

const data = [];
for (let i = 0; i < 40; i++) {
  data.push({
    key: i.toString(),
    MAC: `00:0A:35:2C:71:A${i}`,
    设备名称: '教学小栈',
    设备ID: `${i}`,
    IP地址:'192.168.188.10',
    位置: '主楼',
    状态: '在线',
    操作: '编辑'
  });
}
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};
export default {
  data() {
    this.cacheData = data.map(item => ({ ...item }));
    return {
      data,
      columns,
      editingKey: '',
      rowSelection
    };
  },
  methods: {
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.filter(item => key === item.key)[0];
      const targetCache = newCacheData.filter(item => key === item.key)[0];
      if (target && targetCache) {
        delete target.editable;
        this.data = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = '';
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
        delete target.editable;
        this.data = newData;
      }
    },
  },
};
</script>
<style>
#components-layout-demo-fixed .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: right;
}
</style>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>

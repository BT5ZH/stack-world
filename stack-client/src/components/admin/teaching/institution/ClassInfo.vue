<template>
  <div align="center" class="grade"><b>班级信息</b>
    <a-table :columns="columns" :data-source="data" bordered 
      :pagination="{
          total: 50,
          'show-size-changer': true,
          'show-quick-jumper': true,
      }"
      class="table_set"
    >
    <template
      v-for="col in ['name', 'student_id', 'class_id', 'sex']"
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
    <template slot="operation" slot-scope="text, record">
      <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.key)">保存</a>
          <a-popconfirm title="确定取消吗?" @confirm="() => cancel(record.key)">
            <a>取消</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.key)">
            <a href="javascript:;">编辑</a>
          </a>
          <a-popconfirm
            v-if="data.length"
            title="确定删除吗?"
            @confirm="() => onDelete(record.key)"
          >
            <a href="javascript:;">删除</a> 
          </a-popconfirm>
        </span>
      </div>
    </template>
  </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    align: 'center',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '学号',
    dataIndex: 'student_id',
    align: 'center',
    scopedSlots: { customRender: 'student_id' },
  },
  {
    title: '班级',
    dataIndex: 'class_id',
    align: 'center',
    scopedSlots: { customRender: 'class_id' },
  },
  {
    title: '性别',
    dataIndex: 'sex',
    align: 'center',
    scopedSlots: { customRender: 'sex' },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
  },
];
const data = [
  {
    key: "1",
    name: "张三",
    student_id: '172001',
    class_id: '软工1702',
    sex: '男',
  },
  {
    key: "2",
    name: "李四",
    student_id: '172002',
    class_id: '软工1702',
    sex: '男',
  },
  {
    key: "3",
    name: "王五",
    student_id: '172003',
    class_id: '软工1702',
    sex: '男',
  },
  {
    key: "4",
    name: "李莉",
    student_id: '172004',
    class_id: '软工1702',
    sex: '女',
  },
];
export default {
  data() {
    this.cacheData = data.map(item => ({ ...item }));
    return {
      data,
      columns,
      editingKey: '',
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
    onDelete(key) {
      const data = [...this.data];
      this.data = data.filter(item => item.key !== key);
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
}
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.table_set {
  margin: 10px 50px;
}
.grade {
  margin: 10px 0 0 0;
  font-size: 18px;
}
</style>
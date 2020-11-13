<template>
  <a-row class="container">
    <a-row class="btn-area">
      <a-button type="primary" @click="addSemester">+ 添加</a-button>
    </a-row>
    <a-row>
      <a-table
        rowKey="index"
        :columns="columns"
        :data-source="data"
        bordered
        :pagination="{
          total: 50,
          'show-size-changer': true,
          'show-quick-jumper': true,
        }"
      >
        <template v-for="col in columnTitles" #[col]="text, record">
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="(e) => handleChange(e.target.value, record.index, col)"
            />
            <template v-else> {{ text }} </template>
          </div>
        </template>

        <template #operation="record">
          <div class="editable-row-operations">
            <span v-if="record.editable">
              <a @click="save(record.index)">保存</a>
              <a-popconfirm
                title="是否取消编辑"
                @confirm="cancel(record.index)"
              >
                <a>取消</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a :disabled="!!editingKey" @click="edit(record.index)">编辑</a>
              &nbsp;&nbsp;
              <a>删除</a>
            </span>
          </div>
        </template>
      </a-table>
    </a-row>
  </a-row>
</template>

<script>
const columns = [
  {
    title: "序号",
    dataIndex: "index",
    scopedSlots: { customRender: "name" },
    align: "center",
  },
  {
    title: "学年",
    dataIndex: "schoolYear",
    scopedSlots: { customRender: "schoolYear" },
    align: "center",
  },
  {
    title: "学期",
    dataIndex: "semester",
    scopedSlots: { customRender: "semester" },
    align: "center",
  },
  {
    title: "教学周",
    dataIndex: "teachingWeek",
    scopedSlots: { customRender: "teachingWeek" },
    align: "center",
  },
  {
    title: "开始日期",
    dataIndex: "startDate",
    scopedSlots: { customRender: "startDate" },
    align: "center",
  },
  {
    title: "结束日期",
    dataIndex: "endDate",
    scopedSlots: { customRender: "endDate" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "operation" },
    align: "center",
  },
];
const data = [
  {
    index: 1,
    schoolYear: "2020-2021",
    semester: "第一学期",
    teachingWeek: "20",
    startDate: "2020-09-01",
    endDate: "2021-01-15",
  },
  {
    index: 2,
    schoolYear: "2020-2021",
    semester: "第二学期",
    teachingWeek: "20",
    startDate: "2021-03-01",
    endDate: "2021-07-20",
  },
];
export default {
  data() {
    this.cacheData = data.map((item) => ({ ...item }));
    return {
      data,
      columns,
      columnTitles: [
        "index",
        "schoolYear",
        "semester",
        "teachingWeek",
        "startDate",
        "endDate",
        "operation",
      ],
      editingKey: "",
    };
  },
  methods: {
    handleChange(value, index, column) {
      const newData = [...this.data];
      const target = newData.filter((item) => index === item.index)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    edit(index) {
      const newData = [...this.data];
      const target = newData.filter((item) => index === item.index)[0];
      this.editingKey = index;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(index) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.filter((item) => index === item.index)[0];
      const targetCache = newCacheData.filter((item) => index === item.index)[0];
      if (target && targetCache) {
        delete target.editable;
        this.data = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = "";
    },
    cancel(index) {
      const newData = [...this.data];
      const target = newData.filter((item) => index === item.index)[0];
      this.editingKey = "";
      if (target) {
        Object.assign(
          target,
          this.cacheData.filter((item) => index === item.index)[0]
        );
        delete target.editable;
        this.data = newData;
      }
    },
    addSemester() {},
  },
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}

.btn-area {
  text-align: right;
  padding-bottom: 10px;
}

.container {
  padding: 10px;
  height: 100%;
}
</style>
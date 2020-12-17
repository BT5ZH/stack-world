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
          total: data.length,
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
              <a @click="deleteit(record.index)">删除</a>
            </span>
          </div>
        </template>
      </a-table>
    </a-row>
    <a-modal
      v-model="visible"
      title="添加"
      @ok="hideModal"
      :maskClosable="false"
    >
      <a-form-model
        :model="addsemester"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="formRules"
      >
        <a-form-model-item label="学年" prop="addschoolYear">
          <a-input
            placeholder="请输入学年"
            v-model="addsemester.addschoolYear"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="学期" prop="addsemester">
          <a-input
            placeholder="请输入学期"
            v-model="addsemester.addsemester"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="教学周" prop="addteachingWeek">
          <a-input
            placeholder="请输入教学周"
            v-model="addsemester.addteachingWeek"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="开始日期" prop="addstartDate">
          <a-input
            placeholder="请输入开始日期"
            v-model="addsemester.addstartDate"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="结束日期" prop="addendDate">
          <a-input
            placeholder="请输入结束日期"
            v-model="addsemester.addendDate"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-row>
</template>

<script>
import axios from "@/utils/axios";
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
let data = [];
export default {
  data() {
    this.cacheData = data.map((item) => ({ ...item }));
    return {
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      addsemester: {
        addschoolYear: "",
        addsemester: "",
        addteachingWeek: "",
        addstartDate: "",
        addendDate: "",
      },
      currentNode: "1",
      formRules: {
        addschoolYear: [{ required: true, message: "上课时间不能为空" }],
        addsemester: [{ required: true, message: "下课时间不能为空" }],
        addteachingWeek: [{ required: true, message: "上课时间不能为空" }],
        addstartDate: [{ required: true, message: "上课时间不能为空" }],
        addendDate: [{ required: true, message: "上课时间不能为空" }],
      },
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
      this.cacheData = this.data.map((item) => ({ ...item }));
      const newData = [...this.data];
      const target = newData.filter((item) => index === item.index)[0];
      this.editingKey = index;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(index) {
      const that = this;
      that.cacheData = that.data.map((item) => ({ ...item }));
      const newData = [...that.data];
      const newCacheData = [...that.cacheData];
      const target = newData.filter((item) => index === item.index)[0];
      const targetCache = newCacheData.filter(
        (item) => index === item.index
      )[0];
      that.editingKey = "";
      const requestData = {
        _id: target.id,
        year: target.schoolYear,
        semester: target.semester,
        weeks: target.teachingWeek,
        start_time: target.startDate,
        end_time: target.endDate,
      };
      if (target && targetCache) {
        axios
          .post("pc/v1/schoolyear/updateSchoolYear", requestData)
          .then(({ data }) => {
            const { status } = data;
            if (!status) {
              that.$message.error("error");
              return;
            }
            delete target.editable;
            that.data = newData;
            Object.assign(targetCache, target);
            that.cacheData = newCacheData;
          })
          .catch(() => {
            that.$message.error("修改失败，请重试！");
          });
      }
    },
    deleteit(index) {
      const that = this;
      console.log(that.data[index - 1].id);
      axios
        .delete("pc/v1/schoolyear/deleteSchoolYear", {
          params: { _id: that.data[index - 1].id },
        })
        .then(({ data }) => {
          const { status } = data;
          if (status) {
            axios
              .get("pc/v1/schoolyear/getAllSchoolYear")
              .then(({ data }) => {
                const { status, schoolYears } = data;
                console.log(data);
                if (!status) {
                  return;
                }
                that.data = schoolYears.map((item, index1) => {
                  let setindex = index1 + 1;
                  let newdata = {};
                  newdata.id = item._id;
                  newdata.schoolYear = item.year;
                  newdata.semester = item.semester;
                  newdata.teachingWeek = item.weeks;
                  newdata.startDate = item.start_time;
                  newdata.endDate = item.end_time;
                  newdata.index = setindex;
                  return newdata;
                });
              })
              .catch(() => {
                this.$message.error("失败，请重试！");
              });
            return;
          }
        })
        .catch(() => {
          this.$message.error("删除失败，请重试！");
        });
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
    hideModal() {
      const {
        addschoolYear,
        addsemester,
        addteachingWeek,
        addstartDate,
        addendDate,
      } = this.addsemester;
      const requestData = {
        year: addschoolYear,
        semester: addsemester,
        weeks: addteachingWeek,
        start_time: addstartDate,
        end_time: addendDate,
      };
      const that = this;
      const url = `pc/v1/schoolyear/addSchoolYear`;
      axios
        .post(url, requestData)
        .then(({ data }) => {
          console.log(data);
          const { status, message } = data;
          console.log(message);
          if (!status) {
            that.$message.error(message);
            return;
          }
          const { schoolYear } = data;
          that.data.push({
            id: schoolYear._id,
            schoolYear: schoolYear.year,
            semester: schoolYear.semester,
            teachingWeek: schoolYear.weeks,
            startDate: schoolYear.start_time,
            endDate: schoolYear.end_time,
            index: that.data.length + 1,
          });
        })
        .catch(() => {
          this.$message.error("添加失败，请重试！");
        });
      this.visible = false;
    },
    addSemester() {
      this.visible = true;
    },
  },
  created: function () {
    const that = this;
    const url = `pc/v1/schoolyear/getAllSchoolYear`;
    axios
      .get(url)
      .then(({ data }) => {
        const { status, schoolYears } = data;
        if (!status) {
          return;
        }
        that.data = schoolYears.map((item, index1) => {
          let setindex = index1 + 1;
          let newdata = {};
          newdata.id = item._id;
          newdata.schoolYear = item.year;
          newdata.semester = item.semester;
          newdata.teachingWeek = item.weeks;
          newdata.startDate = item.start_time;
          newdata.endDate = item.end_time;
          newdata.index = setindex;
          return newdata;
        });
      })
      .catch(() => {
        this.$message.error("失败，请重试！");
      });
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
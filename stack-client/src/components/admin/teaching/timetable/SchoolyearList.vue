<template>
  <div>
   <a-row class="btn-area"></a-row>
    <a-spin :spinning="spin_status" tip="Loading...">
      <a-table
        rowKey="_id"
        :pagination="{
          total: schoolyearList.length,
          pageSizeOptions: pageSize,
          'show-less-items': true,
          'show-size-changer': true,
          'show-quick-jumper': true,
          'hide-on-single-page': true,
        }"
        :bordered="true"
        :row-selection="{
          selectedRowKeys: selectedSchoolyears,
          onChange: onSelectChange,
          type:'radio'
        }"
        :columns="columns"
        :data-source="schoolyearList"
      >
        <template #operation="record">
          <a-button type="link" @click="editSchoolyear(record)">编辑</a-button>
          <a-button type="link" @click="deleteSchoolyear(record)">删除</a-button>
        </template>
      </a-table>
    </a-spin>
    <!-- 添加对话框 -->
    <!-- <a-modal v-model="editModal_visible" title="编辑学年" @ok="edit_submit">
      <a-form
        :modal="edit_class"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-model-item label="学院">
          <a-select v-model="subOrg_name">
            <a-select-option
              v-for="item in colleges"
              :key="item._id"
              :value="item.subOrgName"
            >
              {{ item.subOrgName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="专业">
           <a-input v-model="form.title" /> -->
          <!-- <a-select v-model="edit_class.major_name">
            <a-select-option
              v-for="item in major_names"
              :key="item._id"
              :value="item.majorName"
            >
              {{ item.majorName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="班级名称">
          <a-input v-model="edit_class.class_name" />
        </a-form-model-item>
      </a-form>
    </a-modal> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import axiosInstance from "@/utils/axios";

export default {
  props: {
    child_refresh: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // 刷新
      refresh: 0,
      //refresh_number: 0,
      // 选择树
      value: undefined,
      pageSize: ["10", "20", "30", "50", "100"],
      editModal_visible: false,
      // 添加班级对话框
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      
      formRules: {
        add_class_name: [{ required: true, message: "班级名不能为空" }],
      },
      columns: [
        {
          title: "学年",
          dataIndex: "year",
          align: "center",
        },
        {
          title: "学期",
          dataIndex: "semester",
          align: "center",
        },
        {
          title: "周数",
          dataIndex: "weeks",
          align: "center",
        },
        {
          title: "开始日期",
          dataIndex: "start_time",
          align: "center",
        },
        {
          title: "结束日期",
          dataIndex: "end_time",
          align: "center",
        },
        {
          title: "当前学期",
          dataIndex: "current",
          align: "center",
        },
        {
          title: "操作",
          align: "center",
          scopedSlots: { customRender: "operation" },
        },
      ],
      selectedSchoolyears: [],
      schoolyearList: [],
    };
  },
  computed: {
    ...mapState({
      Tree_spin_status: (state) => state.admin.Tree_spin_status,
      spin_status: (state) => state.admin.spin_status,
      orgName: (state) => state.public.org_name,
      oid: (state) => state.public.oid,
    }),
  },
  created() {
    this.getSchoolYeardata();
  },
  mounted() {
 
  },
  watch: {
    child_refresh(val) {
      this.refresh = this.child_refresh
    },
    refresh(val) {
      this.getSchoolYeardata();
    },
  },
  methods: {
    async getSchoolYeardata() {
      const queryObject = { org_name: this.orgName };
      let queryString = "";
      Object.keys(queryObject).forEach((key) => {
        queryString += key + "=" + queryObject[key] + "&";
      });
      queryString = "?" + queryString.slice(0, -1);
      const url = "/pc/v1/schoolyears/getAllSchoolYears"+ queryString;
      try {
        // this.spin_status = true;
        this.$store.dispatch("admin/change_spin_status", true);
        const { data } = await axiosInstance.get(url);
        // this.spin_status = false;
        this.$store.dispatch("admin/change_spin_status", false);
        // console.log("---data---");
        // console.log(data.data.classes);
        this.schoolyearList = data.sy.map(item=>{
          let current = '是'
          if(item.current==="f") current = '否'

          return{
            ...item,
            current:current,
          }
        });
        // this.schoolyearList.map((item) => {
        //   item.studentNum = item.students.length;
        // });
     
      } catch (err) {
        console.log(err);
      }
    },

    // 表格选择
    onSelectChange(selectedKeys) {
      // 表格信息的选中
      this.selectedSchoolyears = selectedKeys;
      console.log(this.selectedSchoolyears)
      
    },
    handle() {
      this.$store.commit("changeState", true);
    },

    // 删除
    async deleteSchoolyear(record) {
      console.log("---record---");
      console.log(record);
      await this.showDeleteConfirm(record._id);
      record=null
      this.$emit("showSelected", record);
    },
    showDeleteConfirm(id) {
      // console.log(deleteList);
      var that = this;
      this.$confirm({
            title: "确认删除吗",
            content: "数据删除后不可恢复",
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            async onOk() {
              // console.log(deleteList);
              //post deleteList
              const url = "/pc/v1/schoolyears/" + id;
              try {
                await axiosInstance.delete(url);
                that.$message.info("删除成功！");
                
                that.refresh += 1;
              } catch (err) {
                console.log(err);
                that.$message.error("删除失败，请重试！");
              }
            },
            onCancel() {
              // console.log("Cancel");
            },
          });
    },
    // 查看详情并进行编辑
    editSchoolyear(record) {
      // console.log("record:"+record._id)
      this.$emit("showSelected", record);
      // this.edit_record = record._id;
      // this.editModal_visible = true;
      // // 编辑
      // this.edit_class = record;
      // this.subOrg_name = record.subOrg_name;
      // // console.log(this.edit_class);
    },
    edit_submit() {
   
      // const requestData = {
      //   org_name: this.orgName,
      //   subOrg_name: this.edit_class.subOrg_name,
      //   major_name: this.edit_class.major_name,
      //   class_name: this.edit_class.class_name,
      // };
      // // console.log(requestData);
      // const url = `pc/v1/classes/` + this.edit_record;
      // axiosInstance
      //   .patch(url, requestData)
      //   .then(({ data }) => {
      //     // console.log(data.status);
      //     this.$message.info("修改成功");
      //     this.refresh += 1;
      //   })
      //   .catch(() => {
      //     this.$message.error("修改失败，请重试！");
      //   });
      // this.editModal_visible = false;
    },
    onChange(data,label) {
      // console.log(data)
      // let payload = {};
      // if (data.slice(-1) == "#") {
      //   let temp = data.slice(0, -1);
      //   payload = { subOrg_name: temp };
      //   this.getClassesFromCondition(payload);
      //   // console.log(payload);
      // } else {
      //   payload = {
      //     subOrg_name: data.substring(data.indexOf(":") + 1),
      //     major_name: data.substring(0, data.indexOf(":")),
      //   };
      //   this.getClassesFromCondition(payload);
      //   // console.log(payload);
      // }
      // this.value = label
    },
    
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
</style>

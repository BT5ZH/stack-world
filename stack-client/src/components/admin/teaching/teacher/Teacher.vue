<template>
  <div class="container">
    <!-- <a-modal v-model="bulkImport_visible" title="批量导入" @ok="bulkimportSubmit">
      <a-upload name="file" :multiple="true" :action="upload_url" @change="handleChange">
        <a-button type='primary'>
          <a-icon type="upload" /> 上传文件
        </a-button>
      </a-upload>
      <br />
      <br />
      <a-button @click='download'>下载模板</a-button>
    </a-modal> -->
    <batchAddTeacher :visible.sync="bulkImport_visible"></batchAddTeacher>
    <a-modal v-model="editModal_visible" title="编辑教师" @ok="handleSubmit">
      <a-form
        :modal="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-model-item label="工号">
          <p>{{ form.user_id }}</p>
        </a-form-model-item>
        <a-form-model-item label="姓名">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="专业">
          <a-input v-model="form.major_name" />
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-switch
            v-model="form.active"
            checked-children="已启用"
            un-checked-children="已禁用"
            @change="onChange"
          />
        </a-form-model-item>
        <a-form-model-item label="职称">
          <!-- <a-input v-model="form.title" /> -->
          <a-select @change="handleSelectChange">
            <a-select-option
              v-model="form.title"
              v-for="item in titles"
              :key="item._id"
              :value="item.title"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="学院">
          <a-select @change="handleSelectChange">
            <a-select-option
              v-model="form.college"
              v-for="item in colleges"
              :key="item._id"
              :value="item.subOrgName"
            >
              {{ item.subOrgName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form>
    </a-modal>

    <div class="btn-area">
      <a-col>
        <a-input-search
          placeholder="姓名"
          enter-button
          v-model="searchContent"
          @search="onSearch(searchContent)"
        />
      </a-col>
      <a-col class="btn">
        <a-button type="primary" @click="changeStatus(selectedTeachers)"
          >启用</a-button
        >
        <a-button type="danger" @click="changeStatus(selectedTeachers)"
          >禁用</a-button
        >
        <!-- <a-button type="primary">注册</a-button> -->
        <a-button type="primary" @click="bulkImport_visible = true"
          >批量导入</a-button
        >
        <a-button type="danger" @click="showDeleteConfirm(selectedTeachers)"
          >批量删除</a-button
        >
      </a-col>
    </div>

    <a-row>
      <a-table
        rowKey="_id"
        :pagination="{
          total: 50,
          'show-size-changer': true,
          'show-quick-jumper': true,
        }"
        :bordered="true"
        :row-selection="{
          selectedRowKeys: selectedTeachers,
          onChange: onSelectChange,
        }"
        :columns="columns"
        :data-source="teacherList"
      >
        <template #operation="record">
          <a-button type="link" @click="editTeacher(record)">编辑</a-button>
          <a-button type="link" @click="resetPassword(record)"
            >重置密码</a-button
          >
          <a-button type="link" @click="deleteTeacher(record)">删除</a-button>
        </template>
        <template #state="text">
          <a-tag color="#388e3c" v-if="text"> 已启用</a-tag>
          <a-tag color="#ff5252" v-else> 已禁用</a-tag>
        </template>
      </a-table>
    </a-row>
  </div>
</template>

<script>
import batchAddTeacher from "./BatchAddTeacher.vue";
import axiosInstance from "@/utils/axios";
import { mapState } from "vuex";
export default {
  components: {
    batchAddTeacher,
  },
  data() {
    const columns = [
      {
        title: "账号（工号）",
        dataIndex: "user_id",
        align: "center",
      },
      {
        title: "教师姓名",
        dataIndex: "name",
        align: "center",
      },
      {
        title: "所属学院",
        dataIndex: "subOrg_name",
        align: "center",
      },
      {
        title: "专业",
        dataIndex: "major_name",
        align: "center",
      },
      {
        title: "职称",
        dataIndex: "title",
        align: "center",
      },
      {
        title: "状态",
        dataIndex: "active",
        align: "center",
        scopedSlots: { customRender: "state" },
      },
      {
        title: "操作",
        scopedSlots: { customRender: "operation" },
        align: "center",
      },
    ];
    return {
      editModal_visible: false,
      bulkImport_visible: false,
      searchContent: null,
      upload_url: "",

      form: {
        user_id: "",
        name: "",
        org_name: "",
        major_name: "",
        title: "",
        active: undefined,
      },
      columns,
      selectedTeachers: [],

      //学院列表
      titles: [
        { _id: "1", title: "教授" },
        { _id: "2", title: "副教授" },
        { _id: "3", title: "讲师" },
      ],
      colleges: [],
      teacherList: [],
    };
  },
  computed: {
    ...mapState({
      orgName: (state) => state.public.org_name,
      role: (state) => state.public.role,
    }),
  },
  mounted() {
    this.getTeacherList();
    this.getSubOrgsName();
  },

  methods: {
    //连接后台获取成功之后记得更改前台数据
    //操作成功或失败弹出提示

    async getTeacherList() {
      // const orgId="5facabb2cf3bb2002b4b3f38"
      const queryObject = {
        org_name: this.orgName,
        // subOrg_name: value,
        role: "teacher",
      };
      let queryString = "";
      Object.keys(queryObject).forEach((key) => {
        queryString += key + "=" + queryObject[key] + "&";
      });
      queryString = "?" + queryString.slice(0, -1);
      const url = "/pc/v1/users/multipleUsers" + queryString;
      console.log(url);
      try {
        const { data } = await axiosInstance.get(url);
        this.teacherList = data.teachers;
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    },

    async getSubOrgsName() {
      const orgId = "5facabb2cf3bb2002b4b3f38";
      const url = "/pc/v1/organizations/" + orgId + "/suborgs";
      try {
        const { data } = await axiosInstance.get(url);
        this.colleges = data.subOrgs;
        console.log(this.colleges);
      } catch (err) {
        console.log(err);
      }
    },

    //table options
    onSelectChange(keys) {
      this.selectedTeachers = keys;
      console.log(this.selectedTeachers);
    },
    //header options
    onSearch(value) {
      console.log(value);
      //调后台接口传value
    },

    //row options
    editTeacher(record) {
      this.editModal_visible = true;
      this.form = record;
      console.log(this.form);
    },
    resetPassword(record) {
      console.log(record);
      //post record._id
    },
    deleteTeacher(record) {
      this.showDeleteConfirm(record._id);
      console.log(record);
      //post record._id
    },

    //modal options
    handleOk(e) {
      console.log(e);
      this.editModal_visible = false;
    },
    handleSubmit(e) {
      console.log(e);
      e.preventDefault();
      console.log(this.form);
      //post form
      this.editModal_visible = false;
    },
    handleSelectChange(value) {
      console.log(value);
    },
    onChange(checked) {
      console.log(`a-switch to ${checked}`);
    },
    changeStatus(changeList) {
      console.log(changeList);
      changeList.length == 0
        ? this.$message.info("请选中要操作的项")
        : this.$confirm({
            title: "确认更改吗",
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk() {
              console.log(changeList);
              //post changeList
            },
            onCancel() {
              console.log("Cancel");
            },
          });
    },
    showDeleteConfirm(deleteList) {
      console.log(deleteList);
      deleteList.length == 0
        ? this.$message.info("请选中要删除的项")
        : this.$confirm({
            title: "确认删除吗",
            content: "数据删除后不可恢复",
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk() {
              console.log(deleteList);
              //post deleteList
            },
            onCancel() {
              console.log("Cancel");
            },
          });
    },

    //bulk import
    download() {
      let url = ""; //输入模板下载url
      window.open(url);
    },
    //上传批量导入表格
    handleChange(info) {
      this.upload_url = ""; //上传地址
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} 上传失败.`);
      }
    },
    //点击上传文件
    bulkimportSubmit() {},
  },
};
</script>

<style scoped>
.container {
  padding: 10px;
  height: 100%;
}

.btn-area {
  width: 100%;
  padding: 20px 0 30px;
  display: flex;
  justify-content: space-between;
}

.btn .ant-btn {
  margin: 0 5px;
}
</style>

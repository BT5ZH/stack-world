<template>
  <div class="container">
    <a-row :span="20" style="margin: 10px 25px 20px 5px">
      <a-tree-select
        style="width: 100%"
        :value="value"
        :placeholder="orgName"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        allow-clear
        tree-default-expand-all
        @change="onTreeChange"
      >
        <a-tree-select-node
          :key="item._id"
          :value="`${item._id}#`"
          :title="item._id"
          v-for="item in peopleTreeList"
        >
          <a-tree-select-node
            :key="title"
            :value="`${item._id}:${title}`"
            :title="title"
            v-for="title in item.title"
          >
          </a-tree-select-node>
        </a-tree-select-node>
      </a-tree-select>
    </a-row>
    <batchAddTeacher :visible.sync="bulkImport_visible"></batchAddTeacher>
    <a-modal v-model="editModal_visible" title="编辑" @ok="handleSubmit">
      <a-form
        :model="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-model-item label="工号">
          <p>{{ form.user_id }}</p>
        </a-form-model-item>
        <a-form-model-item label="姓名">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="学院">
          <a-select @change="handleSelectChange" v-model="subOrg_name">
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
          <a-select v-model="form.major_name">
            <a-select-option
              v-for="item in major_names"
              :key="item._id"
              :value="item.majorName"
            >
              {{ item.majorName }}
            </a-select-option>
          </a-select>
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
          <a-select @change="handleSelectChange" v-model="form.title">
            <a-select-option
              v-for="item in titles"
              :key="item._id"
              :value="item.title"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form>
    </a-modal>

    <a-row>
      <div>
        <a-row>
          <div class="btn-area">
            <a-col> </a-col>
            <a-col class="btn">
              <a-button
                type="primary"
                @click="changeStatus(selectedTeachers, 0)"
                >启用</a-button
              >
              <a-button type="danger" @click="changeStatus(selectedTeachers, 1)"
                >禁用</a-button
              >

              <a-button type="primary" @click="bulkImport_visible = true"
                >批量导入</a-button
              >
              <a-button
                type="danger"
                @click="showDeleteConfirm(selectedTeachers)"
                >批量删除</a-button
              >
            </a-col>
          </div>
        </a-row>
        <a-row>
          <a-table
            :key="tableIndex"
            rowKey="_id"
            :pagination="{
              total: teacherList.length,
              pageSizeOptions: pageSize,
              'show-less-items': true,
              'show-size-changer': true,
              'show-quick-jumper': true,
              'hide-on-single-page': true,
            }"
            :bordered="true"
            :row-selection="{
              selectedRowKeys: selectedTeachers,
              onChange: onRowChange,
            }"
            :columns="columns"
            :data-source="teacherList"
          >
            <template #operation="record">
              <a-button type="link" @click="editTeacher(record)">编辑</a-button>
              <a-button type="link" @click="resetPassword(record)"
                >重置密码</a-button
              >
              <a-button type="link" @click="deleteTeacher(record)"
                >删除</a-button
              >
            </template>
            <template #state="text">
              <a-tag color="#388e3c" v-if="text"> 已启用</a-tag>
              <a-tag color="#ff5252" v-else> 已禁用</a-tag>
            </template>
          </a-table>
        </a-row>
      </div>
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
        title: "工号（学号）",
        dataIndex: "user_id",
        align: "center",
      },
      {
        title: "姓名",
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
        title: "身份",
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
      value: undefined,
      editModal_visible: false,
      bulkImport_visible: false,
      searchContent: null,
      upload_url: "",
      tableIndex: 0,
      pageSize: ["10", "20", "30", "50", "100"],
      form: {
        user_id: "",
        name: "",
        subOrg_name: "",
        major_name: "",
        title: "",
        active: undefined,
      },
      user_id: "",
      columns,
      selectedTeachers: [],

      //学院列表
      titles: [
        { _id: "1", title: "教授" },
        { _id: "2", title: "副教授" },
        { _id: "3", title: "讲师" },
      ],
      subOrg_name: "",
      colleges: [],
      major_names: [],
      teacherList: [],
      peopleTreeList: [],
    };
  },
  computed: {
    ...mapState({
      orgName: (state) => state.public.orgName,
      oid: (state) => state.public.oid,
      role: (state) => state.public.role,
    }),
  },
  mounted() {
    // 获取学院名
    this.getSubOrgsName();
    // this.getTeacherList();
    // this.getSubOrgsName();
    this.getTreeList();
  },
  watch: {
    tableIndex() {
      this.getTeacherList();
    },
    subOrg_name(val) {
      // 根据学院找到专业赋值
      this.form.subOrg_name = val;
      // console.log(val)
      this.getmajors(val);
    },
  },
  methods: {
    async getSubOrgsName() {
      // 获取学院名
      const orgId = this.oid;
      const url = "/pc/v1/organizations/" + orgId + "/suborgs";
      try {
        const { data } = await axiosInstance.get(url);
        this.colleges = data.subOrgs;
      } catch (err) {
        console.log(err);
      }
    },
    async getmajors(queryString) {
      // 按获取专业
      // console.log(queryString)
      // console.log(this.orgName
      this.form.major_name = "";
      const url =
        "/pc/v1/organizations/" + this.orgName + "/suborgs/" + queryString;
      try {
        const { data } = await axiosInstance.get(url);
        // console.log(data)
        this.major_names = data.majors;
        // console.log(data.data.majors);
      } catch (err) {
        console.log(err);
      }
    },
    //连接后台获取成功之后记得更改前台数据
    //操作成功或失败弹出提示
    handleUpdateClick() {
      this.tableIndex += 1;
    },
    async getTreeList() {
      try {
        // console.log(this.orgName);
        const url =
          "/pc/v1/users/getUsersBySubOrgAndSortByTitle?org_name=" +
          this.orgName;
        const { data } = await axiosInstance(url);
        this.peopleTreeList = data.result;
        // console.log(data);
      } catch (err) {
        console.log(err);
      }
    },
    async getTeacherList(payload) {
      // const queryObject = {
      //   org_name: this.orgName,
      //   role: "teacher",
      // };
      let queryObject = payload;
      let queryString = "";
      Object.keys(queryObject).forEach((key) => {
        queryString += key + "=" + queryObject[key] + "&";
      });
      queryString = "?" + queryString.slice(0, -1);
      const url = "/pc/v1/users/multipleUsers" + queryString;
      // console.log(url);
      try {
        const { data } = await axiosInstance.get(url);
        this.teacherList = data.teachers;
        // console.log(data);
      } catch (err) {
        console.log(err);
      }
    },

    //table options
    onRowChange(keys) {
      this.selectedTeachers = keys;
      console.log(this.selectedTeachers);
    },

    //row options
    editTeacher(record) {
      console.log("---record---");
      // console.log(record);
      this.editModal_visible = true;
      this.form = record;
      this.subOrg_name = record.subOrg_name;
      // console.log(this.form);
      this.user_id = record._id;
      // console.log(this.form);
    },
    resetPassword(record) {
      // console.log(record);
    },
    deleteTeacher(record) {
      this.showDeleteConfirm(record._id);
      console.log(record);
    },

    //modal options
    // handleOk(e) {
    //   console.log(e);
    //   this.editModal_visible = false;
    //   this.handleUpdateClick();
    // },
    handleSubmit() {
      // console.log(this.user_id);
      let url = `pc/v1/users/${this.user_id}`;
      let that = this;
      console.log("---form---");
      console.log(this.form);
      axiosInstance.patch(url, this.form).then(
        function (res) {
          console.log(res);
          that.$message.success("编辑成功");
        },
        function (err) {
          console.log(err);
          that.$message.error("编辑失败");
        }
      );
      //post form
      this.editModal_visible = false;
      this.handleUpdateClick();
    },

    handleSelectChange(value) {
      console.log(value);
    },
    handleCancel(e) {
      this.$message.warning("取消修改");
      this.handleUpdateClick();
    },
    onChange(checked) {
      console.log(`a-switch to ${checked}`);
    },
    changeStatus(changeList, e) {
      let that = this;
      changeList.length == 0
        ? this.$message.info("请选中要操作的项")
        : this.$confirm({
            title: "确认更改吗",
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk() {
              if (e === 0) {
                changeList.forEach(async (item) => {
                  let url = `pc/v1/users/${item}`;
                  // that.$store.commit("admin/getUserState", item);
                  let data = {
                    active: true,
                  };
                  try {
                    await axiosInstance.patch(url, data);
                    that.$message.success("启用成功");
                  } catch (err) {
                    console.log(err);
                    that.$message.error("启用失败");
                  }
                });
              } else if (e === 1) {
                changeList.forEach(async (item) => {
                  let url = `pc/v1/users/${item}`;
                  // that.$store.commit("admin/getUserState", item);
                  let data = {
                    active: false,
                  };
                  try {
                    await axiosInstance.patch(url, data);
                    that.$message.success("禁用成功");
                  } catch (err) {
                    console.log(err);
                    that.$message.error("禁用失败");
                  }
                });
              }
              that.handleUpdateClick();
              that.getTeacherList();
            },
            onCancel() {
              console.log("Cancel");
              that.$message.warning("操作取消");
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
              console.log("changeList[0]");
              //post changeList
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
    async onTreeChange(value, label) {
      // console.log("onchange:  value " + value);
      // console.log("onchange:   label" + label);
      this.flag = value;
      if (this.flag.slice(-1) == "#") {
        let payload = {};
        let temp = this.flag.slice(0, -1);
        payload = { subOrg_name: temp, org_name: this.orgName };
        this.getTeacherList(payload);
      } else {
        let payload = {};
        let dataArray = this.flag.split(":");
        // console.log(dataArray);
        let secString = "";
        let role = "teacher";
        switch (dataArray[1]) {
          case "教授":
            secString = "professor";
            break;
          case "副教授":
            secString = "vice-professor";
            break;
          case "讲师":
            secString = "lecturer";
            break;
          case "学生":
            role = "student";
            secString = "student";
            break;
          default:
            break;
        }
        payload = {
          org_name: this.orgName,
          subOrg_name: dataArray[0],
          title: secString,
          role: role,
        };
        // console.log(payload);
        this.getTeacherList(payload);
      }
      this.value = label;
    },
  },

  // async getNewTeacherList(value) {
  //   let queryString = "";
  //   if (value.title == null) {
  //     queryString = "&subOrg_name=" + value.subOrg_name;
  //     console.log(queryString);
  //   } else {
  //     queryString =
  //       "&subOrg_name=" + value.subOrg_name + "&title=" + value.title;
  //   }
  //   console.log("value====?" + queryString);
  //   const url =
  //     "/pc/v1/users?role=teacher&org_name=" + this.orgName + queryString;
  //   const { data } = await axiosInstance.get(url);
  //   this.teacherList = data.users;
  //   console.log(data);
  //   console.log(this.teacherList);
  // },
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

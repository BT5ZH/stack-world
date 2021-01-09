<template>
  <div>
    <a-row :span="20" style="margin: 10px 25px 20px 5px">
      <a-spin :spinning="Tree_spin_status" tip="Loading...">
        <a-tree-select
          style="width: 100%"
          :value="value"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :placeholder="orgName"
          allow-clear
          tree-default-expand-all
          @change="onChange"
        >
          <a-tree-select-node
            :key="item._id"
            :value="`${item._id}#`"
            :title="item._id"
            v-for="item in treeData"
          >
            <a-tree-select-node
              :key="mName"
              :value="`${mName}:${item._id}`"
              :title="mName"
              v-for="mName in item.majors"
            >
            </a-tree-select-node>
          </a-tree-select-node>
        </a-tree-select>
      </a-spin>
    </a-row>

    <a-row class="btn-area">
      <a-col :span="5"> </a-col>
      <a-col :span="10"></a-col>
      <a-col :span="9" class="btn">
        <a-button type="primary" @click="addClasses">添加班级</a-button>
        <a-button type="primary" disabled>批量删除</a-button>
      </a-col>
    </a-row>
    <a-spin :spinning="spin_status" tip="Loading...">
      <a-table
        rowKey="_id"
        :pagination="{
          total: classList.length,
          pageSizeOptions: pageSize,
          'show-less-items': true,
          'show-size-changer': true,
          'show-quick-jumper': true,
          'hide-on-single-page': true,
        }"
        :bordered="true"
        :row-selection="{
          selectedRowKeys: selectedClasses,
          onChange: onSelectChange,
        }"
        :columns="columns"
        :data-source="classList"
      >
        <template #operation="record">
          <a-button type="link" @click="viewClassInfo(record)">详情</a-button>
          <a-button type="link" @click="editclass(record)">编辑</a-button>
          <a-button type="link" @click="deleteclass(record)">删除</a-button>
        </template>
      </a-table>
    </a-spin>
    <!-- 添加班级对话框 -->
    <a-modal
      v-model="visible"
      title="添加"
      @ok="hideModal"
      :maskClosable="false"
    >
      <a-form-model
        :model="addclass"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="formRules"
      >
        <a-form-model-item label="学校" prop="add_org_name">
          {{ orgName }}
        </a-form-model-item>
        <a-form-model-item label="学院" prop="add_subOrg_name">
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
        <a-form-model-item label="专业" prop="add_major_name">
          <a-select v-model="addclass.add_major_name">
            <!-- v-model="form.major_name" -->
            <a-select-option
              v-for="item in major_names"
              :key="item._id"
              :value="item.majorName"
            >
              {{ item.majorName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="班级名" prop="add_class_name">
          <a-input
            placeholder="请输入班级名"
            v-model="addclass.add_class_name"
          ></a-input>
        </a-form-model-item>
        <!-- 学生怎么加？？？ -->
      </a-form-model>
    </a-modal>
    <!-- 编辑对话框 -->
    <a-modal v-model="editModal_visible" title="编辑班级" @ok="edit_submit">
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
          <!-- <a-input v-model="form.title" /> -->
          <a-select v-model="edit_class.major_name">
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
    </a-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axiosInstance from "@/utils/axios";

export default {
  data() {
    return {
      // treeSpin_status: false,
      // spin_status: false,
      // 刷新
      refresh: 0,
      // 选择树
      value: undefined,
      pageSize: ["10", "20", "30", "50", "100"],
      treeData: [],
      // 编辑对话框
      edit_record_id: "",
      editModal_visible: false,
      edit_class: {
        subOrg_name: "",
        major_name: "",
        class_name: "",
      },
      major_names: [],
      // major_names: [{major_name:"软件工程"},{major_name:"人工智能"}],
      colleges: [],
      teacherList: [],
      // 添加班级对话框
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      addclass: {
        add_subOrg_name: "",
        add_major_name: "",
        add_class_name: "",
      },
      subOrg_name: "",
      //
      currentNode: "1",
      formRules: {
        add_class_name: [{ required: true, message: "班级名不能为空" }],
      },
      columns: [
        {
          title: "班级名称",
          dataIndex: "class_name",
          align: "center",
        },
        {
          title: "学院",
          dataIndex: "subOrg_name",
          align: "center",
        },
        {
          title: "专业",
          dataIndex: "major_name",
          align: "center",
        },
        {
          title: "学生数量",
          dataIndex: "studentNum",
          align: "center",
        },
        {
          title: "操作",
          align: "center",
          scopedSlots: { customRender: "operation" },
        },
      ],
      selectedClasses: [],
      classList: [],
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
    // 获取班级
    this.getclassdata();
  },
  mounted() {
    // 获取学院名
    this.getSubOrgsName();
    // 获取选择树
    this.getTreeData();
  },
  watch: {
    refresh(val) {
      this.getclassdata();
      this.getTreeData();
    },
    subOrg_name(val) {
      // 根据学院找到专业赋值
      this.addclass.add_subOrg_name = val;
      this.edit_class.subOrg_name = val;
      // if (this.subOrg_name !== record.subOrg_name) {
      //   this.edit_class.major_name = ""; //一旦改变学院，清空原始数据
      //   this.edit_class.class_name = "";
      // }
      // console.log(val)
      this.getmajors(val);
    },
  },
  methods: {
    async getTreeData() {
      let queryString = this.orgName;
      const url = "/pc/v1/classes/classTree?org_name=" + queryString;
      // console.log(url);
      try {
        // this.treeSpin_status = true;
        this.$store.dispatch("admin/change_Tree_spin_status",true)
        const { data } = await axiosInstance.get(url);
        this.$store.dispatch("admin/change_Tree_spin_status", false);
        // console.log("---spin---");
        // console.log(this.Tree_spin_status);
        // console.log(this.orgName)
        // this.treeSpin_status = false;
        // console.log(data.data);
        this.treeData = data.data;
      } catch (err) {
        console.log(err);
      }
    },
    async getmajors(queryString) {
      // 按获取专业
      // console.log(queryString)
      // console.log(this.orgName)
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
    async getSubOrgsName() {
      // 获取学院名
      const url = "/pc/v1/organizations/" + this.oid + "/suborgs";
      try {
        const { data } = await axiosInstance.get(url);
        this.colleges = data.subOrgs;
      } catch (err) {
        console.log(err);
      }
    },
    async getclassdata() {
      // 获取全部班级信息
      const url = "/pc/v1/classes";
      try {
        // this.spin_status = true;
        this.$store.dispatch("admin/change_spin_status", true);
        const { data } = await axiosInstance.get(url);
        // this.spin_status = false;
        this.$store.dispatch("admin/change_spin_status", false);
        // console.log(...data.data.classes[0].students);
        this.classList = data.data.classes;
        this.classList.map((item) => {
          item.studentNum = item.students.length;
        });
        // console.log("-----classList-----")
        // console.log(this.classList)
      } catch (err) {
        console.log(err);
      }
    },
    // 添加班级
    addClasses() {
      // 添加班级对话框的打开
      this.visible = true;
    },
    hideModal() {
      // 添加班级对话框的确定
      const { add_subOrg_name, add_major_name, add_class_name } = this.addclass;
      let add_org_name = this.orgName;
      const requestData = {
        org_name: add_org_name,
        subOrg_name: add_subOrg_name,
        major_name: add_major_name,
        class_name: add_class_name,
      };
      // console.log(this.addclass)
      const url = `pc/v1/classes`;
      axiosInstance
        .post(url, requestData)
        .then(({ data }) => {
          // console.log(data);
          this.$message.info("添加成功！");
          this.refresh += 1;
        })
        .catch(() => {
          this.$message.error("添加失败，请重试！");
        });
      this.visible = false;
    },
    // 表格选择
    onSelectChange(selectedKeys) {
      // 表格信息的选中
      this.selectedClasses = selectedKeys;
    },
    onSearch() {},
    handle() {
      this.$store.commit("changeState", true);
    },
    viewClassInfo(record) {
      // console.log(record)
      this.$router.push({
        name: "admin_classinfo",
        query: {
          classId: record.id,
          orgName: this.orgName,
          subOrg_name: record.subOrg_name,
          major_name: record.major_name,
          class_name: record.class_name,
        },
      });
    },
    // 删除班级
    async deleteclass(record) {
      await this.showDeleteConfirm(record._id);
      // console.log(record);
      //post record._id
    },
    showDeleteConfirm(deleteList) {
      // console.log(deleteList);
      var that = this;
      deleteList.length == 0
        ? this.$message.info("请选中要删除的项")
        : this.$confirm({
            title: "确认删除吗",
            content: "数据删除后不可恢复",
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            async onOk() {
              // console.log(deleteList);
              //post deleteList
              const url = "/pc/v1/classes/" + deleteList;
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
    // 编辑班级
    editclass(record) {
      // console.log("record:"+record._id)
      this.edit_record = record._id;
      this.editModal_visible = true;
      // 编辑
      this.edit_class = record;
      this.subOrg_name = record.subOrg_name;
      // console.log(this.edit_class);
    },
    edit_submit() {
      // console.log(this.edit_class);
      //post form
      const requestData = {
        org_name: this.orgName,
        subOrg_name: this.edit_class.subOrg_name,
        major_name: this.edit_class.major_name,
        class_name: this.edit_class.class_name,
      };
      // console.log(requestData);
      const url = `pc/v1/classes/` + this.edit_record;
      axiosInstance
        .patch(url, requestData)
        .then(({ data }) => {
          // console.log(data.status);
          this.$message.info("修改成功");
          this.refresh += 1;
        })
        .catch(() => {
          this.$message.error("修改失败，请重试！");
        });
      this.editModal_visible = false;
    },
    onChange(data) {
      // console.log(data)
      let payload = {};
      if (data.slice(-1) == "#") {
        let temp = data.slice(0, -1);
        payload = { subOrg_name: temp };
        this.getClassesFromCondition(payload);
        // console.log(payload);
      } else {
        payload = {
          subOrg_name: data.substring(data.indexOf(":") + 1),
          major_name: data.substring(0, data.indexOf(":")),
        };
        this.getClassesFromCondition(payload);
        // console.log(payload);
      }
    },
    async getClassesFromCondition(payload) {
      // 按条件检索班级
      const url = "/pc/v1/classes/search";
      try {
        const { data } = await axiosInstance.post(url, payload);
        // console.log("--classes----");
        // console.log(data.data.classes);
        this.classList = data.data.classes;
        this.classList.map((item) => {
          item.studentNum = item.students.length;
        });
      } catch (err) {
        console.log(err);
      }
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

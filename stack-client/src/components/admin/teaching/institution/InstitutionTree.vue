<template>
  <div>
    <a-tree
      :load-data="onLoadData"
      :tree-data="treeData"
      :show-line="true"
      @select="onSelect"
      :defaultExpandedKeys="['1']"
    />
    <div class="btn-area">
      <a-button-group>
        <a-button @click="addCollegeVisible = true" type="primary">
          + 学院
        </a-button>
        <a-button @click="addMajorVisible = true" type="primary">
          + 专业
        </a-button>
        <a-button @click="edit" type="primary">编辑</a-button>
        <a-button @click="removeVisible = true" type="primary">删除</a-button>
      </a-button-group>
    </div>

    <!-- Dialog Begin -->

    <a-modal
      v-model="addCollegeVisible"
      :title="editVisible ? '编辑学院' : '添加学院'"
      @ok="addCollege"
      :maskClosable="false"
    >
      <a-form-model
        :model="addCollegeForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="formRules"
      >
        <a-form-model-item label="学院名称" prop="collegeName">
          <a-input
            placeholder="请输入学院名称"
            v-model="addCollegeForm.collegeName"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="学院简介" prop="collegeDesc">
          <a-textarea
            placeholder="请输入学院简介"
            :auto-size="{ minRows: 3, maxRows: 8 }"
            v-model="addCollegeForm.collegeDesc"
          ></a-textarea>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal
      v-model="addMajorVisible"
      :title="editVisible ? '编辑专业' : '添加专业'"
      @ok="addMajor"
      :maskClosable="false"
    >
      <a-form-model
        :model="addMajorForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="formRules"
      >
        <a-form-model-item label="专业名称" prop="majorName">
          <a-input
            placeholder="请输入专业名称"
            v-model="addMajorForm.majorName"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="专业简介" prop="majorDesc">
          <a-textarea
            placeholder="请输入专业简介"
            :auto-size="{ minRows: 3, maxRows: 8 }"
            v-model="addMajorForm.majorDesc"
          ></a-textarea>
        </a-form-model-item>
        <a-form-model-item label="开设时间" prop="startDate">
          <a-date-picker v-model="addMajorForm.startDate" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { treeNodeTiles } from "@/utils/antComponent";
import axios from "@/utils/axios";
import errHandler from "@/utils/errorHandler";
import { mapState } from 'vuex'

export default {
  name: "InstitutionTree",
  data() {
    return {
      treeData: [
        {
          title: "陕西师范大学",
          key: "1",
          children: [
            {
              title: "计算机科学学院",
              key: "1-1",
              children: [
                { title: "人工智能", key: "1-1-1", isLeaf: true },
                { title: "软件工程", key: "1-1-2", isLeaf: true },
              ],
            },
            { title: "材料科学与工程学院", key: "1-2", isLeaf: true },
          ],
        },
      ],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      addCollegeVisible: false,
      addCollegeForm: {
        collegeName: "",
        collegeDesc: "",
      },
      addMajorVisible: false,
      addMajorForm: {
        majorName: "",
        majorDesc: "",
        startDate: "",
      },
      editVisible: false,
      removeVisible: false,
      currentNode: "1",
      formRules: {
        collegeName: [{ required: true, min: 3, message: "学院名称最少3个字" }],
        collegeDesc: [{ required: true, message: "学院简介不能为空" }],
        majorName: [{ required: true, min: 3, message: "专业名称最少2个字" }],
        majorDesc: [{ required: true, message: "专业简介不能为空" }],
        startDate: [{ required: true, message: "开办时间不能为空" }],
      },
    };
  },
  computed: {
    ...mapState({
      sid: state => state.sid
    })
  },
  methods: {
    onLoadData(treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        // to request data

        // setTimeout(() => {
        //   treeNode.dataRef.children = [
        //     { title: "Child Node", key: `${treeNode.eventKey}-0` },
        //     { title: "Child Node", key: `${treeNode.eventKey}-1` },
        //   ];
        //   this.treeData = [...this.treeData];
        //   resolve();
        // }, 1000);
      });
    },
    onSelect([selectedKey]) {
      this.currentNode = selectedKey;
      if (treeNodeTiles(selectedKey) === 3) {
        // college id <= selectedKey
        // to request class data by college id;
      }
    },
    onChange() {},
    addCollege() {},
    addMajor() {
      const { collegeName, collegeDesc } = this.addCollegeForm;
      const requestData = {
        subOrgName: collegeName,
        subOrgIntro: collegeDesc
      };
      const url = `pc/v1/organizations/${this.sid}/suborgs`;
      axios.post(url, requestData )
      .then(({data}) => {
        console.log(data);
      })
      .catch(errHandler.call(this));

    },
    edit() {
      const nodeTile = treeNodeTiles(this.currentNode);
      if (nodeTile === 1) {
        // give some tips
        return;
      }
      if (nodeTile === 2) {
        this.editVisible = true;
        this.addCollegeVisible = true;
        return;
      }
      if (nodeTile === 3) {
        this.editVisible = true;
        this.addMajorVisible = true;
      }
    },
    remove() {},
  },
};
</script>

<style scoped>
.btn-area {
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
}
</style>
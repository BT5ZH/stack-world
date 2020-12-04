<template>
  <div>
    <a-row style="margin:30px">
      <a-col :span="4">
        <a-select v-model="school" style="width: 100%">
          <a-select-option
            v-for="(item,index) in schoolList"
            :key="index"
            :value="item.schoolKey"
          >{{item.schoolName}}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="4" :push="16">
        <a-button type="primary" @click="addAdmin">添加管理</a-button>
        <a-button type="primary" style="margin-left:10px;" @click="disabledAdmin">冻结管理</a-button>
      </a-col>
    </a-row>
    <a-modal
      title="添加管理"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model
        :model="addUserInfo"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="昵称" prop="userNickname">
          <a-input placeholder="请输入昵称" v-model="addUserInfo.userNickname"></a-input>
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="userEmail">
          <a-input placeholder="请输入邮箱" v-model="addUserInfo.userEmail"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-row style="margin:30px">
      <a-col :span="6" v-for="(item,index) in userInfoList" :key="index">
        <a-card
          hoverable
          style="width: 300px;margin-bottom:10px;justify-content:space-around;"
          align="center"
        >
          <a-avatar style="backgroundColor:#87d068" :size="64" icon="user" src />
          <a-card-meta :description="item.userNickname" class="card_info"></a-card-meta>
          <a-card-meta :description="item.userEmail"></a-card-meta>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      school: "请选择学校",
      visible: false,
      confirmLoading: false,
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      rules: {
        userNickname: [
          {
            required: true,
            min: 1,
            message: "昵称最少2个字",
          },
        ],
        userEmail: [{ required: true, message: "邮箱不能为空" }],
      },
      addUserInfo: {
        userNickname: "",
        userEmail: "",
      },
      schoolList: [
        {
          schoolKey: "snnu",
          schoolName: "陕西师范大学",
        },
        {
          schoolKey: "xiy",
          schoolName: "西安邮电大学",
        },
        {
          schoolKey: "xw",
          schoolName: "西安外国语学院",
        },
        {
          schoolKey: "ca",
          schoolName: "长安大学",
        },
      ],
      userInfoList: [
        {
          userNickname: "青空",
          userEmail: "2756878164@qq.com",
        },
        {
          userNickname: "qingKong",
          userEmail: "2756878164@qq.com",
        },
        {
          userNickname: "qingKong",
          userEmail: "2756878164@qq.com",
        },
        {
          userNickname: "qingKong",
          userEmail: "2756878164@qq.com",
        },
        {
          userNickname: "qingKong",
          userEmail: "2756878164@qq.com",
        },
      ],
    };
  },
  methods: {
    onClick(e) {
      console.log(e.item.$slots.default[0].elm.data);
      this.school = e.item.$slots.default[0].elm.data;
    },

    addAdmin() {
      console.log("addAdmin");
      this.visible = true;
    },
    disabledAdmin() {
      console.log("disabledAdmin");
    },

    handleOk() {
      console.log("Clicked ok button");
      // console.log(this.addUserInfo);
      let Nickname = this.addUserInfo.userNickname;
      let Email = this.addUserInfo.userEmail;
      let user = {
        userNickname: Nickname,
        userEmail: Email,
      };
      this.userInfoList.push(user);
      // console.log(this.userInfoList);
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
        this.addUserInfo.userNickname = "";
        this.addUserInfo.userEmail = "";
      }, 2000);
    },
    handleCancel() {
      console.log("Clicked cancel button");
      this.visible = false;
    },
  },
};
</script>

<style>
.card_info {
  margin: 10px;
}
</style>
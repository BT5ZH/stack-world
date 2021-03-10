<template>
  <div class="userContainer">
    <a-card class="userCard">
      <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
        <a-form-model-item has-feedback label="密码" prop="pass">
          <a-input v-model="ruleForm.pass" type="password" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="确认密码" prop="checkPass">
          <a-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
        </a-form-model-item>
        <!-- <a-form-model style="text-align: center; color: #777">
          <span>密码至少八位</span>
        </a-form-model> -->
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="submitForm('ruleForm')"> 确认修改 </a-button>
          <a-button style="margin-left: 10px" @click="resetForm('ruleForm')">
            清空
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password again"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "change" }],
        checkPass: [{ validator: validatePass2, trigger: "change" }],
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      },
    };
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
    }),
  },
  methods: {
    submitForm(formName) {
      console.log("come submit");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("student/changeUserInfo", {
              password: this.ruleForm.pass,
              uid: this.uid,
            })
            .then((res) => {
              console.log(res);
              res == "success"
                ? this.$message.success("修改成功")
                : this.$message.error("修改失败");
            });
        } else {
          this.$message.error("修改失败");
          return false;
        }
      });
    },
    // postForm(data) {
    //   this.$store.dispatch("student/changeUserInfo", data);
    // },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

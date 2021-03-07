<template>
  <a-modal
    class="backbody"
    :visible="visible"
    title="修改密码"
    @ok="handleOk"
    width="35%"
    @cancel="$emit('update:visible', false)"
  >
    <a-form-model
      ref="ruleForm"
      :rules="rules"
      :model="ruleForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <!-- <a-form-model-item label="旧密码">
        <a-input type='password' v-model="modifyPwdForm.oldPwd"></a-input>
      </a-form-model-item> -->
      <a-form-model-item label="新密码" prop="pass">
        <a-input type='password' v-model="ruleForm.pass" ></a-input>
      </a-form-model-item>
      <a-form-model-item label="确认密码" prop="checkPass">
        <a-input type='password' v-model="ruleForm.checkPass" ></a-input>
      </a-form-model-item>
      
    </a-form-model>
  </a-modal>
</template>

<script>
import axios from "@/utils/axios";
import moment from "moment";
import { mapState, mapGetters } from "vuex";

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
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
      //refresh: 0,
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
      ruleForm: {
        //oldPwd: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "change" }],
        checkPass: [{ validator: validatePass2, trigger: "change" }],
      },
    };
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
    }),
    // lesson_id() {
    //   return this.$route.query.lessonId;
    // },
    
  },
  methods: {

    onOk(value) {
      console.log("onOk: ", value);
    },
   
    handleOk() {
      // TODO 表单验证
      this.submit();
      // console.log("--------------"+this.homeworkForm.type)
      // console.log("+++++++++ "+this.curCourseHour)
    },

    submit() {
      if( this.ruleForm.pass!= this.ruleForm.checkPass)
         this.$message.error("新密码与确认密码不一致");
      else{
        axios
          .patch("pc/v1/users/"+this.uid, {
            password: this.ruleForm.pass,
          })
          .then(({ data }) => {
            if (data.status === "success") {
              this.$message.success("密码更新成功");
              this.$emit("update:visible", false);
            }
          })
          .catch((err) => {
            console.error(err);
            this.$message.error("密码更新失败");
          });
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postForm({ password: this.ruleForm.pass }).then((res) => {
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
    postForm(data) {
      this.$store.dispatch("student[表情]angeUserInfo", data);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
 
  
  },

  mounted() {
    // this.$store.dispatch("teacher/getSources", {
    //   lesson_id: this.lesson_id,
    //   teacher_id: this.uid,
    // });
  },
};
</script>

<style scoped>
.options {
  padding-left: 30px;
  position: relative;
  right: 10px;
  margin-bottom: 20px;
}
.datepicker {
  z-index: 111;
}
.backbody {
  position: relative;
  z-index: 1;
}
</style>

<template>
  <div style="width: 95%; margin: 1.2rem auto">
    <div class="homeworkDescribe">
      <p>
        作业类型: <span>{{ task_type }}</span>
      </p>
      <p>
        作业内容:
        <span>{{ homeworkItem.content }}</span>
      </p>
      <p>
        截止日期: <span>{{ homeworkItem.deadline }}</span>
      </p>

      <a-button
        class="downloadHomework"
        :disabled="disableAttachmentButton"
        type="primary"
        icon="download"
        @click="download(homeworkItem.attachment_url)"
      >
        作业附件
      </a-button>

      <p></p>
    </div>

    <!-- <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="作业描述" prop="desc">
                <a-input v-model="form.desc" type="textarea" />
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="resetForm">
                    保存
                </a-button>
                <a-button type="danger" style="margin-left: 10px;" @click="onSubmit">
                    提交
                </a-button>
            </a-form-model-item>
        </a-form-model> -->
    <a-form-model
      :model="homeworkForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="答题区域">
        <a-textarea
          :disabled="disableCommentsArea"
          placeholder="请输入答案"
          :auto-size="{ minRows: 6, maxRows: 8 }"
          v-model="homeworkForm.content"
        >
        </a-textarea>
      </a-form-model-item>
      <a-form-model-item label="老师评语">
        <a-textarea
          disabled
          placeholder="老师什么都没说..."
          :auto-size="{ minRows: 4, maxRows: 8 }"
          v-model="homeworkForm.comments"
        >
        </a-textarea>
      </a-form-model-item>
      <a-form-model-item label="作业分数">
        <a-input disabled v-model="homeworkForm.score">
          <a-icon slot="prefix" type="user" />
          <a-tooltip slot="suffix" title="Extra information">
            <a-icon type="info-circle" style="color: rgba(0, 0, 0, 0.45)" />
          </a-tooltip>
        </a-input>
      </a-form-model-item>

      <a-form-model-item label="本次操作">
        <a-radio-group v-model="homeworkForm.type">
          <a-radio :value="1">暂存</a-radio>
          <a-radio :value="2">提交</a-radio>
        </a-radio-group>
      </a-form-model-item>

      <a-button class="downloadHomework" type="primary" @click="submitHomework"
        >确定</a-button
      >
    </a-form-model>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import axios from "@/utils/axios";
export default {
  data() {
    return {
      disableCommentsArea: false,
      disableAttachmentButton: false,
      homeworkItem: {},
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
      homeworkForm: {
        comments: "",
        score: 0,
        content: "",
        type: 1,
      },

      // labelCol: { span: 4 },
      // wrapperCol: { span: 14 },
      // other: '',
      // form: {
      //     name: '',
      //     region: undefined,
      //     date1: undefined,
      //     delivery: false,
      //     type: [],
      //     resource: '',
      //     desc: '',
      // },
      // rules: {
      //     name: [
      //         { required: true, message: 'Please input Activity name', trigger: 'blur' },
      //         { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
      //     ],
      //     region: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
      //     date1: [{ required: true, message: 'Please pick a date', trigger: 'change' }],
      //     type: [
      //         {
      //             type: 'array',
      //             required: true,
      //             message: 'Please select at least one activity type',
      //             trigger: 'change',
      //         },
      //     ],
      //     resource: [
      //         { required: true, message: 'Please select activity resource', trigger: 'change' },
      //     ],
      //     desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
      // },
    };
  },

  methods: {
    submitHomework() {
      let homework_id = this.homeworkItem.hid;
      let student_id = this.uid;
      let content = this.homeworkForm.content;
      let flg = 0; //flg=0 means just save the homework,flg=1 means submit the homework to teacher
      if (this.homeworkForm.type === 2) flg = 1;
      axios
        .post("pc/v1/submithomeworks", {
          homework_id: homework_id,
          student_id: student_id,
          content: this.homeworkForm.content,
          flg: flg,
        })
        .then(({ data }) => {
          if (data.status === "success") {
            this.$message.success("提交作业成功");
            // this.$router.push({
            // query: { ...this.$route.query, homeworkRefresh: --this.refresh },
            // });
            //this.$emit("update:visible", false);
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("提交作业失败");
        });
    },
    download(url) {
      window.open(url);
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
  },
  created: function () {
    // this.getCourse();
    let index = this.homeworkList.findIndex((item) => {
      return item.hid === this.$route.query.id;
    });
    this.homeworkItem = this.homeworkList[index];
    this.homeworkForm = {
      comments: this.homeworkItem.comments,
      score: this.homeworkItem.score,
      content: this.homeworkItem.answer,
      type: 1,
    };
    if (this.homeworkItem.attachment_url === "none")
      this.disableAttachmentButton = true;
    //flg=0 means that the student just saved the homework. he can edit it again
    if (this.homeworkItem.flg != 0) this.disableCommentsArea = true;
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
      homeworkList: (state) => state.student.homeworkList,
    }),
    task_type() {
      if (this.homeworkItem.task_type === "homework") {
        return "课后作业";
      } else return "课前预习";
    },
  },
};
</script>

<style>
.downloadHomework {
  margin-left: 70%;
}
.homeworkDescribe p {
  font-size: 15px;
  color: black;
  font-weight: bold;
}
.homeworkDescribe span {
  font-family: 'Courier New', Courier, monospace;
  font-weight: normal;
}
</style>
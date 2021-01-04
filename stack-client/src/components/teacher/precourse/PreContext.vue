<template>
  <a-row style="height: 100%">
    <a-row
      type="flex"
      justify="space-between"
      align="middle"
      style="padding: 20px"
    >
      <a-col :span="6" style="display: flex; align-items: center">
        <span>时长：</span>
        <a-input placeholder="50" v-model="form.time" style="width: 80%" />
      </a-col>
      <a-col :span="8" style="display: flex; align-items: center">
        <span>描述：</span>
        <a-textarea
          placeholder="本节课重难点"
          v-model="form.desc1"
          allow-clear
          @change="onChange"
          :auto-size="{ minRows: 3, maxRows: 3 }"
          style="width: 80%"
        />
      </a-col>
      <a-col :span="8">
        <a-row type="flex" justify="end" class="header-btn">
          <a-button type="primary" @click="save"> 保存 </a-button>
          &nbsp;&nbsp;
          <a-button type="primary" @click="pptvisible = true"> 上传 </a-button>
          &nbsp;&nbsp;
          <a-button type="primary" :disabled="true" @click="publish">
            发布
          </a-button>
        </a-row>
      </a-col>
    </a-row>
    <a-modal
      @cancel="pptvisible = false"
      @ok="uploadFile"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      centered
      width="40%"
      :closable="false"
      :destroyOnClose="true"
      v-model="pptvisible"
      :zIndex="10001"
    >
      <a-form-model
        :model="fileForm"
        ref="fileForm"
        labelAlign="left"
        :rules="formRules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="ppt名称" prop="name">
          <a-input
            placeholder="请输入ppt名称"
            v-model="fileForm.name"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
      <a-upload-dragger
        :multiple="true"
        :before-upload="fileInput"
        :file-list="fileList"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">点击或拖拽以上传ppt</p>
        <p class="ant-upload-hint">请上传ppt</p>
      </a-upload-dragger>
    </a-modal>
    <a-row class="box">
      <a-row type="flex" justify="end" style="padding: 20px">
        <a-col>
          <a-radio-group button-style="solid">
            <a-space>
              <a-radio-button @click="addsteps"> 添加事件 </a-radio-button>
              &nbsp;&nbsp;
              <a-radio-button @click="changesteps"> 修改事件 </a-radio-button>
              &nbsp;&nbsp;
              <a-radio-button @click="deletesteps"> 删除事件 </a-radio-button>
            </a-space>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-modal
        title="修改事件"
        v-model="changevisible"
        @ok="changeOk"
        @cancel="changeClose"
        :zIndex="10001"
        width="40%"
      >
        <a-row type="flex" align="middle">
          <a-col :span="15">
            修改时间：
            <a-input-number
              id="inputNumber"
              v-model="time"
              :min="1"
              :max="1000"
            />分钟
          </a-col>
          <a-col>
            已设置/总时长： {{ this.sumtime }}/{{ this.form.time }}
          </a-col>
        </a-row>
        <br />
        <div>
          <a-radio-group
            v-model="componentId"
            default-value="PreTeaching"
            button-style="solid"
            size="small"
          >
            <a-space>
              <a-radio-button value="PreTeaching"> 讲课 </a-radio-button>
              <a-radio-button value="PreQuestion"> 提问 </a-radio-button>
              <a-radio-button value="PreCompete"> 抢答 </a-radio-button>
              <a-radio-button value="PreVote"> 投票 </a-radio-button>
              <a-radio-button value="PreSign"> 签到 </a-radio-button>
              <a-popover trigger="hover">
                <template slot="content">
                  <p>视频,word,pdf,excel,图片等</p>
                </template>
                <a-radio-button value="PreDocument"> 文件下发 </a-radio-button>
              </a-popover>
              <a-radio-button value="PreTest"> 随堂测试 </a-radio-button>
              <a-radio-button value="PreHomework"> 布置作业 </a-radio-button>
            </a-space>
          </a-radio-group>
        </div>
        <br />
        <a-alert
          type="error"
          message="添加失败，超过设置总时间，请重试！"
          banner
          v-show="show"
        />
      </a-modal>
      <a-modal
        title="选择事件"
        v-model="modalvisible"
        @ok="handleOk"
        @cancel="modalClose"
        :zIndex="10001"
        width="40%"
      >
        <a-row type="flex" align="middle">
          <a-col :span="15">
            花费时间：
            <a-input-number
              id="inputNumber"
              v-model="time"
              :min="1"
              :max="1000"
            />分钟
          </a-col>
          <a-col>
            已设置/总时长： {{ this.sumtime }}/{{ this.form.time }}
          </a-col>
        </a-row>
        <br />
        <div>
          <a-radio-group
            v-model="componentId"
            default-value="PreTeaching"
            button-style="solid"
            size="small"
          >
            <a-space>
              <a-radio-button value="PreTeaching"> 讲课 </a-radio-button>
              <a-radio-button value="PreQuestion"> 提问 </a-radio-button>
              <a-radio-button value="PreCompete"> 抢答 </a-radio-button>
              <a-radio-button value="PreVote"> 投票 </a-radio-button>
              <a-radio-button value="PreSign"> 签到 </a-radio-button>
              <a-popover trigger="hover">
                <template slot="content">
                  <p>视频,word,pdf,excel,图片等</p>
                </template>
                <a-radio-button value="PreDocument"> 文件下发 </a-radio-button>
              </a-popover>
              <a-radio-button value="PreTest"> 随堂测试 </a-radio-button>
              <!-- <a-radio-button value="PreHomework"> 布置作业 </a-radio-button> -->
            </a-space>
          </a-radio-group>
        </div>
        <br />
        <a-alert
          type="error"
          message="添加失败，超过设置总时间，请重试！"
          banner
          v-show="show"
        />
      </a-modal>
      <a-row
        justify="space-between"
        type="flex"
        align="middle"
        class="steptype"
      >
        <a-col :span="24" @contextmenu.prevent="deletesteps">
          <a-steps
            size="small"
            progress-dot
            v-model="current"
            @change="addChange"
          >
            <a-step
              v-for="(step, index) in steps"
              :key="index"
              :title="step.title"
              :description="step.description"
            />
          </a-steps>
        </a-col>
      </a-row>
      <br />
      <br />
      <a-row class="contextstyle">
        <a-empty :description="false" v-if="isempty" />
        <component :is="componentId" v-else></component>
      </a-row>
    </a-row>
  </a-row>
</template>
<script>
// import PreHomework from "./preselect/PreHomework.vue";
import PreTeaching from "./preselect/PreTeaching.vue";
import PreQuestion from "./preselect/PreQuestion.vue";
import PreCompete from "./preselect/PreCompete.vue";
import PreVote from "./preselect/PreVote.vue";
import PreSign from "./preselect/PreSign.vue";
import PreDocument from "./preselect/PreDocument.vue";
import PreTest from "./preselect/PreTest.vue";
import axios from "@/utils/axios";

import { mapState, mapGetters } from "vuex";
import fileUploader from "@/utils/S3FileUploader";

export default {
  components: {
    PreTeaching,
    PreQuestion,
    PreCompete,
    PreVote,
    PreSign,
    PreDocument,
    PreTest,
    // PreHomework,
  },
  data() {
    return {
      fileList: [],
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
      fileForm: { name: "" },
      confirmLoading: false,
      formRules: {
        name: [{ required: true, message: "资源名称不能为空" }],
      },
      form: {
        desc1: "",
        time: 50,
      },
      show: false,
      time: 10,
      oldtime: 0,
      sumtime: 0,
      current: 0,
      steps: [
        { title: "讲课", description: "20分钟" },
        { title: "提问", description: "5分钟" },
      ],
      event: {
        PreVote: "投票",
        PreSign: "签到",
        PreCompete: "抢答",
        PreQuestion: "提问",
        PreTeaching: "讲课",
        PreTest: "随堂测试",
        PreDocument: "文件下发",
        // PreHomework: "布置作业",
      },
      slidervalue: 5,
      modalvisible: false,
      changevisible: false,
      pptvisible: false,
      selectevent: "",
      componentId: "PreTeaching",
    };
  },
  computed: {
    isempty() {
      return !!Object.keys(this.current).length;
    },
    ...mapGetters({
      curCourseHour: "teacher/curCourseHour",
    }),
    ...mapState({
      uid: (state) => state.public.uid,
    }),
    lesson_id() {
      return this.$route.query.lessonId;
    },
  },
  methods: {
    onChange() {},
    save() {
      // const { desc1, time } = this.form;
      // const requestData = {
      //   year: desc1,
      //   semester: time,
      // };
      // const that = this;
      // const url = `pc/v1/schoolyear/addSchoolYear`;
      // axios
      //   .post(url, requestData)
      //   .then(({ data }) => {
      //     console.log(data);
      //     const { status, message } = data;
      //     console.log(message);
      //     if (!status) {
      //       that.$message.error(message);
      //       return;
      //     }
      //     const { schoolYear } = data;
      //     that.data.push({
      //       id: schoolYear._id,
      //       schoolYear: schoolYear.year,
      //       semester: schoolYear.semester,
      //       teachingWeek: schoolYear.weeks,
      //       startDate: schoolYear.start_time,
      //       endDate: schoolYear.end_time,
      //       index: that.data.length + 1,
      //     });
      //   })
      //   .catch(() => {
      //     this.$message.error("添加失败，请重试！");
      //   });
      this.$store.dispatch("teacher/updateCourseHour", {
        lesson_id: this.lesson_id,
        teacher_id: this.uid,
      });
    },
    publish() {},
    addChange(current) {
      this.current = current;
      let findsteps = this.steps[current].title;
      let result = Object.keys(this.event).find((item) => {
        return this.event[item] === findsteps;
      });
      this.$store.commit("teacher/updateNodeIndex", current);
      this.componentId = result;
    },
    addsteps() {
      this.sumtime = 0;
      this.steps.map((item) => {
        this.sumtime += item.description.split("分钟")[0] - 0;
      });
      this.modalvisible = true;
    },
    handleOk() {
      this.sumtime += this.time;
      this.show = false;
      if (this.sumtime <= this.form.time) {
        const steptime = this.time + "分钟";
        this.steps.push({
          title: this.event[this.componentId],
          description: steptime,
        });
        this.current = this.steps.length - 1;
        this.modalvisible = false;
      } else {
        this.sumtime -= this.time;
        this.show = true;
      }
    },
    modalClose() {
      this.modalvisible = false;
    },
    changesteps() {
      this.sumtime = 0;
      this.steps.map((item) => {
        this.sumtime += item.description.split("分钟")[0] - 0;
      });
      this.time = this.steps[this.current].description.split("分钟")[0] - 0;
      this.oldtime = this.time;
      this.changevisible = true;
    },
    changeOk() {
      this.sumtime -= this.oldtime;
      this.sumtime += this.time;
      this.show = false;
      if (this.sumtime <= this.form.time) {
        this.$store.commit("teacher/updateNodeIndex", this.current);
        const steptime = this.time + "分钟";
        this.steps.splice(this.current, 1, {
          title: this.event[this.componentId],
          description: steptime,
        });
        this.changevisible = false;
      } else {
        this.sumtime -= this.time;
        this.sumtime += this.oldtime;
        this.show = true;
      }
    },
    changeClose() {
      this.changevisible = false;
    },
    deletesteps() {
      const that = this;
      this.$confirm({
        title: "确定删除此事件吗?",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        zIndex: 10001,
        onOk() {
          let time = that.steps[that.current].description.split("分钟")[0];
          that.sumtime -= time;
          that.steps.splice(that.current, 1);
          that.current = that.steps.length - 1;
          that.onChange(that.current);
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    fileInput(file) {
      console.log(file);
      this.fileList = [file];
      return false;
    },
    uploadFile() {
      this.confirmLoading = true;
      const that = this;
      const config = {
        that,
        apiUrl: "/pc/v1/resources/upload",
        filePath: `${this.oid}/teacher/`,
        body: that.createResource(),
        successCallback() {
          that.$message.success("上传成功！");
          that.confirmLoading = false;
        },
        failCallback(err) {
          console.error(err);
          that.confirmLoading = false;
          that.$message.error("上传失败！");
        },
        progressCallback(...args) {
          console.log({ args });
        },
      };
      const params = { Metadata: { star: "10" } };
      fileUploader(this.fileList, config, params);
    },
  },
  watch: {
    curCourseHour(value) {
      const type = {
        Vote: "投票",
        Sign: "签到",
        Race: "抢答",
        Ask: "提问",
        Teach: "讲课",
        Test: "随堂测试",
        Dispatch: "文件下发",
        // Homework: "布置作业",
      };
      console.log(value);
      const { PPT, description, duration, name, nodes } = value;
      this.form.desc1 = description;
      this.form.time = duration;
      this.steps = nodes.map((item, index) => {
        let time = nodes[index].time;
        let titletag = type[item.tag];
        return { title: titletag, description: time };
      });
    },
  },
};
</script>

<style scoped>
.steptype {
  padding: 5px;
  width: 100%;
  overflow-x: auto;
}

.event-btn .ant-btn {
  margin: 0 5px;
}

.box {
  background: #fff;
  margin-top: 10px;
}

.contextstyle {
  height: 65%;
  padding: 20px;
}

.try {
  width: 100%;
  height: 100%;
  padding: 30px;
}

.precompeteclass {
  background: #fff;
  height: 100%;
  width: 100%;
}
.header-btn .ant-btn {
  margin: 0 5px;
}
</style>
<style>
</style>
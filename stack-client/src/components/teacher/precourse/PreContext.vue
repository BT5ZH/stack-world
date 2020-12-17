<template>
  <a-row style="height: 100%">
    <a-row class="box">
      <a-row type="flex" justify="end" style="padding: 20px">
        <a-col>
          <a-radio-group button-style="solid">
            <a-space>
              <a-radio-button @click="addsteps"> 添加事件 </a-radio-button>
              &nbsp;&nbsp;
              <a-radio-button @click="deletesteps"> 删除事件 </a-radio-button>
            </a-space>
          </a-radio-group>
        </a-col>
      </a-row>
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
            @change="onChange"
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
    <a-modal
      title="选择事件"
      v-model="modalvisible"
      @ok="handleOk"
      @cancel="modalClose"
      :zIndex="10001"
    >
      <a-row>
        花费时间:
        <a-input-number
          id="inputNumber"
          v-model="time"
          :min="1"
          :max="1000"
        />分钟
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
    </a-modal>
  </a-row>
</template>
<script>
import PreHomework from "./preselect/PreHomework.vue";
import PreTeaching from "./preselect/PreTeaching.vue";
import PreQuestion from "./preselect/PreQuestion.vue";
import PreCompete from "./preselect/PreCompete.vue";
import PreVote from "./preselect/PreVote.vue";
import PreSign from "./preselect/PreSign.vue";
import PreDocument from "./preselect/PreDocument.vue";
import PreTest from "./preselect/PreTest.vue";

export default {
  components: {
    PreTeaching,
    PreQuestion,
    PreCompete,
    PreVote,
    PreSign,
    PreDocument,
    PreTest,
    PreHomework,
  },
  data() {
    return {
      time: 10,
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
        PreHomework: "布置作业",
      },
      slidervalue: 5,
      modalvisible: false,
      selectevent: "",
      componentId: "PreTeaching",
    };
  },
  computed: {
    isempty() {
      return !!Object.keys(this.current).length;
    },
  },
  methods: {
    onChange(current) {
      this.current = current;
      let findsteps = this.steps[current].title;
      let result = Object.keys(this.event).find((item) => {
        return this.event[item] === findsteps;
      });
      this.componentId = result;
    },
    addsteps() {
      this.modalvisible = true;
    },
    handleOk() {
      const steptime = this.time + "分钟";
      this.steps.push({
        title: this.event[this.componentId],
        description: steptime,
      });
      this.current = this.steps.length-1;
      this.modalvisible = false;
    },
    modalClose() {
      this.modalvisible = false;
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
          that.steps.splice(that.current, 1);
          that.current = that.steps.length-1;
          that.onChange(that.current);
        },
        onCancel() {
          console.log("Cancel");
        },
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
  /* height: calc(100% - 20px); */
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
</style>
<style>
.ant-modal-content {
  width: 540px !important;
}
</style>
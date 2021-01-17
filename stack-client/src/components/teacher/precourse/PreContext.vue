<template>
  <a-row style="height: 100%">
    <a-row
      type="flex"
      justify="space-between"
      align="middle"
      style="padding: 20px"
    >
      <a-col :span="6" style="display: flex; align-items: center">
        <span>总时长：</span>
        <a-input placeholder="50" v-model="form.time" style="width: 80%" />
      </a-col>
      <a-col :span="14" style="display: flex; align-items: center">
        <span>描述：</span>
        <a-textarea
          placeholder="本节课重难点"
          v-model="form.desc1"
          :auto-size="{ minRows: 2, maxRows: 2 }"
          style="width: 80%"
        />
      </a-col>
      <a-col :span="4">
        <a-row type="flex" justify="end" class="header-btn">
          <a-space>
            <a-button type="primary" @click="pptvisible = true">
              选择PPT
            </a-button>
            <a-button type="primary" @click="save"> 保存 </a-button>
          </a-space>
        </a-row>
        <br />
        <a-row type="flex" justify="end" v-if="!publish"
          >已选择PPT：{{ ppt.name }}
        </a-row>
        <a-row type="flex" justify="end" v-else>请选择PPT </a-row>
      </a-col>
    </a-row>
    <a-modal title="选择ppt" v-model="pptvisible" :zIndex="10001" width="40%">
      <a-radio-group name="radioGroup" v-model="ppt">
        <a-radio
          :style="radioStyle"
          v-for="(item, index) in pptsource"
          :key="item.id"
          :value="item"
        >
          <a :href="item.url" target="_blink">
            {{ index + 1 }}. {{ item.name }}</a
          >
        </a-radio>
      </a-radio-group>
      <a-row type="flex" justify="center">
        <a-pagination
          class="pagination"
          :total="pptsource.length"
          :show-quick-jumper="true"
        ></a-pagination>
      </a-row>
      <template #footer>
        <a-button type="primary" @click="selectppt"> 确定 </a-button>
      </template>
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
            修改耗时：
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
            耗时：
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
      // 讲课标记
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
      pptsource: [],
      ppt: {},
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
      form: {
        desc1: "",
        time: 50,
      },
      show: false,
      time: 10,
      oldtime: 0,
      sumtime: 0,
      current: 0,
      steps: [],
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
      eventname: {
        PreVote: "Vote",
        PreSign: "Sign",
        PreCompete: "Race",
        PreQuestion: "Ask",
        PreTeaching: "Teach",
        PreTest: "Test",
        PreDocument: "Dispatch",
      },
      slidervalue: 5,
      modalvisible: false,
      changevisible: false,
      pptvisible: false,
      selectevent: "",
      componentId: "",
    };
  },
  computed: {
    lecture() {
      //判断有无演讲
      let lecture_status;
      for (let i = 0; i < this.steps.length; i++) {
        if (this.steps[i].title == "讲课") {
          lecture_status = true;
          break;
        } else {
          lecture_status = false;
        }
      }
      return lecture_status;
    },
    isempty() {
      if (this.current == -1) {
        return true;
      } else {
        return false;
      }
    },
    ...mapGetters({
      curCourseHour: "teacher/curCourseHour",
    }),
    ...mapState({
      uid: (state) => state.public.uid,
      nodes: (state) => state.teacher.precourse.nodes,
    }),
    lesson_id() {
      return this.$route.query.lessonId;
    },
    publish() {
      return !this.ppt.id;
    },
  },
  methods: {
    selectppt() {
      const ppt = { name: this.ppt.name, rsId: this.ppt.id, url: this.ppt.url };
      this.$store.commit("teacher/updatePPT", ppt);
      this.pptvisible = false;
    },
    save() {
      try {
        // 判断有无讲课以及有无ppt
        if (this.lecture) {
          if (this.ppt.id == "") {
            this.$info({
              title: "讲课必须要有ppt哦",
              zIndex: 10001,
            });
            return;
          }
        }
        this.$store.commit("teacher/updateCourseHourInfo", {
          time: this.form.time,
          description: this.form.desc1,
        });
        const h = this.$createElement;
        if (this.$store.state.nodes == []) {
          this.$info({
            title: "请注意先暂存事件",
            zIndex: 10001,
          });
        }
        this.$store.dispatch("teacher/updateCourseHour", {
          lesson_id: this.lesson_id,
          teacher_id: this.uid,
        });
        this.$message.info("保存成功");
      } catch (err) {
        this.$message.error("保存失败");
        console.log(err);
      }
    },
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
        const node = {
          people_num: 3,
          tag: this.eventname[this.componentId],
          time: steptime,
          vote: [
            {
              options: ["", ""],
              question_type: 2,
              right_answer: "",
              title: "",
            },
          ],
        };
        this.current = this.steps.length - 1;
        this.$store.commit("teacher/updateNodeIndex", this.current);
        this.$store.commit("teacher/addNode", node);
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
        const node = {
          people_num: 0,
          tag: this.eventname[this.componentId],
          time: steptime,
          vote: [
            {
              options: ["", ""],
              question_type: 2,
              right_answer: "",
              title: "",
            },
          ],
        };
        this.$store.commit("teacher/updateNodeIndex", this.current);
        this.$store.commit("teacher/updateNode", node);
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
          that.$store.commit("teacher/deleteNode", that.current);
          that.current = that.steps.length - 1;
          that.addChange(that.current);
        },
        onCancel() {
          console.log("Cancel");
        },
      });
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
      this.current = 0;
      const { PPT, description, duration, name, nodes } = value;
      this.form.desc1 = description;
      this.form.time = duration;
      if (PPT.rsId && this.pptsource.some((item) => item.id === PPT.rsId)) {
        this.ppt = { id: PPT.rsId, url: PPT.url, name: PPT.name };
      } else {
        this.ppt = { name: "", id: "", url: "" };
      }
      if (nodes.length) {
        this.componentId = Object.keys(this.eventname).find((item) => {
          return this.eventname[item] === nodes[0].tag;
        });
      } else {
        this.componentId = "";
      }
      this.steps = nodes.map((item, index) => {
        let time = nodes[index].time;
        let titletag = type[item.tag];
        return { title: titletag, description: time };
      });
    },
  },
  mounted() {
    this.$store.dispatch("teacher/getSources", {
      lesson_id: this.lesson_id,
      teacher_id: this.uid,
    });
    this.pptsource = this.$store.getters["teacher/getPPTSource"];
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
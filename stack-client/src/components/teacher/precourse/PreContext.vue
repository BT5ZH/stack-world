<template>
  <div class="csp">
    <div class="cspH">
      <div
        class="cspH--tag"
        :class="[{ 'cspH--tag--default': showTag[0] }]"
        @click="tagChange(0)"
      >
        备课详情
      </div>
      <div
        class="cspH--tag"
        :class="[{ 'cspH--tag--default': showTag[1] }]"
        @click="tagChange(1)"
      >
        课程资源
      </div>
      <div
        class="cspH--tag"
        :class="[{ 'cspH--tag--default': showTag[2] }]"
        @click="tagChange(2)"
      >
        课程试题
      </div>
      <div
        class="cspH--tag"
        :class="[{ 'cspH--tag--default': showTag[3] }]"
        @click="tagChange(3)"
      >
        课程作业
      </div>
    </div>
    <div class="cspC">
      <div class="cspC--tag" v-if="showTag[0]">
        <a-row
          type="flex"
          justify="space-between"
          align="middle"
          style="background: #f9f0fa; padding: 20px"
        >
          <a-col :span="6" style="display: flex; align-items: center">
            <h3>{{ courseHours }}(学时)✖️ 50分钟/学时</h3>
            <!-- <a-input v-model="form.time" style="width: 80%" /> -->
          </a-col>
          <a-col :span="14" style="display: flex; align-items: center">
            <span>描述：</span>
            <a-input
              placeholder="本节课重难点"
              v-model="form.desc1"
              style="width: 80%"
            />
          </a-col>
          <a-col :span="4">
            <a-button type="primary" @click="save"> 保存 </a-button>
          </a-col>
        </a-row>
        <a-modal title="选择ppt" v-model="pptvisible" width="40%">
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
                  <a-radio-button @click="changesteps">
                    修改事件
                  </a-radio-button>
                  &nbsp;&nbsp;
                  <a-radio-button @click="deletesteps">
                    删除事件
                  </a-radio-button>
                </a-space>
              </a-radio-group>
            </a-col>
          </a-row>
          <a-modal
            title="修改事件"
            v-model="changevisible"
            @ok="changeOk"
            @cancel="changeClose"
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
                  <a-radio-button value="PreRandomSign">
                    随机点名
                  </a-radio-button>
                  <a-radio-button value="PreSign"> 签到 </a-radio-button>
                  <a-popover trigger="hover">
                    <template slot="content">
                      <p>视频,word,pdf,excel,图片等</p>
                    </template>
                    <a-radio-button value="PreDocument">
                      文件下发
                    </a-radio-button>
                  </a-popover>
                  <a-radio-button value="PreTest"> 随堂测试 </a-radio-button>
                  <a-radio-button value="PreHomework">
                    布置作业
                  </a-radio-button>
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
                button-style="solid"
                size="small"
              >
                <a-space>
                  <a-radio-button value="PreTeaching"> 讲课 </a-radio-button>
                  <a-radio-button value="PreQuestion"> 提问 </a-radio-button>
                  <a-radio-button value="PreCompete"> 抢答 </a-radio-button>
                  <a-radio-button value="PreVote"> 投票 </a-radio-button>
                  <a-radio-button value="PreSign"> 签到 </a-radio-button>
                  <a-radio-button value="PreRandomSign">
                    随机点名
                  </a-radio-button>
                  <a-popover trigger="hover">
                    <template slot="content">
                      <p>视频,word,pdf,excel,图片等</p>
                    </template>
                    <a-radio-button value="PreDocument">
                      文件下发
                    </a-radio-button>
                  </a-popover>
                  <a-radio-button value="PreTest"> 随堂测试 </a-radio-button>
                  <!-- <a-radio-button value="PreHomework"> 布置作业 </a-radio-button>PreRandomSign -->
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
                v-if="steps"
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
            <div v-if="isempty" />
            <component
              @selectppt="pptvisible = true"
              :is="componentId"
              v-else
            ></component>
          </a-row>
        </a-row>
      </div>
      <div class="cspC--tag" v-if="showTag[1]">
        <div class="resourceBlock" style="background: #f9f0fa; padding: 20px">
          <div :span="4">
            <a-button type="primary" @click="uploadVisible = true">
              上传资源
            </a-button>
          </div>
          <br />
          <local-uploader :visible.sync="uploadVisible"></local-uploader>
          <resource-list></resource-list>
        </div>
      </div>
      <div class="cspC--tag" v-if="showTag[2]">
        <div
          class="resourceBlock"
          style="background: #f9f0fa; padding: 20px; margin-top: 20px"
        >
          <div :span="4">
            <a-button type="primary" @click="questionVisible = true">
              添加试题 </a-button
            >&nbsp;&nbsp;
            <a-button type="primary" @click="bulkImport_visible = true">
              批量导入</a-button
            >
          </div>
          <add-question :visible.sync="questionVisible"></add-question>
          <question-list></question-list>
        </div>
      </div>

      <div class="cspC--tag" v-if="showTag[3]">
        <div
          class="resourceBlock"
          style="background: #f9f0fa; padding: 20px; margin-top: 20px"
        >
          <div :span="4">
            <a-button type="primary" @click="homeworkVisible = true">
              布置作业
            </a-button>
          </div>
          <add-homework :visible.sync="homeworkVisible"></add-homework>
          <homework-list></homework-list>
        </div>
      </div>
    </div>
    <div>
      <batch-add-question
        :visible.sync="bulkImport_visible"
      ></batch-add-question>
    </div>
  </div>
</template>

<script>
// import PreHomework from "./preselect/PreHomework.vue";PreRandomSign
import PreTeaching from "./preselect/PreTeaching.vue";
import PreQuestion from "./preselect/PreQuestion.vue";
import PreCompete from "./preselect/PreCompete.vue";
import PreVote from "./preselect/PreVote.vue";
import PreSign from "./preselect/PreSign.vue";
import PreRandomSign from "./preselect/PreRandomSign.vue";
import PreDocument from "./preselect/PreDocument.vue";
import PreTest from "./preselect/PreTest.vue";
// import PreResource from "./preselect/PreResource";
import LocalUploader from "@/components/teacher/coursedetail/resource/Local";
import AddQuestion from "@/components/teacher/coursedetail/question/AddQuestion";
import AddHomework from "@/components/teacher/coursedetail/homework/AddHomework";
import ResourceList from "./ResourceList";
import QuestionList from "./QuestionList";
import HomeworkList from "./HomeworkList";
import axios from "@/utils/axios";

import { mapState, mapGetters } from "vuex";
import fileUploader from "@/utils/S3FileUploader";
import BatchAddQuestion from "./BatchAddQuestion.vue";
//import AddHomework from '../coursedetail/homework/AddHomework.vue';

export default {
  components: {
    PreTeaching,
    PreQuestion,
    PreCompete,
    PreVote,
    PreSign,
    PreDocument,
    PreTest,
    LocalUploader,
    ResourceList,
    QuestionList,
    HomeworkList,
    AddQuestion,
    PreRandomSign,
    AddHomework,
    BatchAddQuestion,
    // PreResource,
    // PreHomework,
  },
  data() {
    return {
      // 讲课标记
      bulkImport_visible: false,
      upload_url: "",
      courseHours: this.$route.query.courseHours,
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
      ppt: {},
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
      form: {
        desc1: "",
        time: 50,
      },
      show: false,
      showTag: [true, false, false],
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
        PreRandomSign: "随机点名",
      },
      eventname: {
        PreVote: "Vote",
        PreSign: "Sign",
        PreCompete: "Race",
        PreQuestion: "Ask",
        PreTeaching: "Teach",
        PreTest: "Test",
        PreDocument: "Dispatch",
        PreRandomSign: "randomSign",
      },
      slidervalue: 5,
      modalvisible: false,
      changevisible: false,
      pptvisible: false,
      selectevent: "",
      componentId: "",
      uploadVisible: false,
      questionVisible: false,
      homeworkVisible: false,
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
    coursePPT() {
      if (this.curCourseHour.PPT) return this.curCourseHour.PPT;
      else return {};
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
      pptsource: "teacher/getPPTSource",
    }),
    ...mapState({
      uid: (state) => state.public.uid,
      nodes: (state) => state.teacher.precourse.nodes,
      // curCourseHour: (state) => state.teacher.precourse.curCourseHour,
    }),
    lesson_id() {
      return this.$route.query.lessonId;
    },
    publish() {
      return !this.ppt.id;
    },
  },
  methods: {
    ////-------the follow section added by qichao
    // showDeleteConfirm(deleteList) {
    //   console.log(deleteList);
    //   deleteList.length == 0
    //     ? this.$message.info("请选中要删除的项")
    //     : this.$confirm({
    //         title: "确认删除吗",
    //         content: "数据删除后不可恢复",
    //         okText: "确定",
    //         okType: "danger",
    //         cancelText: "取消",
    //         onOk() {
    //           console.log(deleteList);
    //           //post deleteList
    //         },
    //         onCancel() {
    //           console.log("Cancel");
    //         },
    //       });
    // },
    // //bulk import
    // download() {
    //   let url = ""; //输入模板下载url
    //   window.open(url);
    // },
    // //上传批量导入表格
    // handleChange(info) {
    //   this.upload_url = ""; //上传地址
    //   if (info.file.status !== "uploading") {
    //     console.log(info.file, info.fileList);
    //   }
    //   if (info.file.status === "done") {
    //     this.$message.success(`${info.file.name} 上传成功`);
    //   } else if (info.file.status === "error") {
    //     this.$message.error(`${info.file.name} 上传失败.`);
    //   }
    // },
    // //点击上传文件
    // bulkimportSubmit() {},
    // parseExcelData() {
    //   xlsxParser(this.fileList[0], {
    //     dataCb: async (data) => {
    //       console.log("extracted data: ", data);
    //       try {
    //         const result = await axios.post("/pc/v1/users/multipleUsers", data);
    //         console.log(result);
    //         this.$message.success("批量导入成功");
    //       } catch (error) {
    //         console.log(error);
    //         this.$message.error("批量导入失败");
    //       }
    //     },
    //   });
    // },
    ////-------the upper section is added by qichao-----------------------------
    selectppt() {
      const ppt = { name: this.ppt.name, rsId: this.ppt.id, url: this.ppt.url };
      this.$store.commit("teacher/updatePPT", ppt);
      this.pptvisible = false;
    },
    save() {
      try {
        // 判断有无讲课以及有无ppt
        if (this.lecture) {
          // this.ppt是界面选择的，coursePPT是数据库里调的
          if (!this.ppt.id && !this.coursePPT.name) {
            this.$info({
              title: "讲课必须要有ppt哦",
            });
            return;
          }
        }
        let nodes = this.$store.state.teacher.nodes;
        if (!this.judgeNodesBlank(nodes)) {
          this.$info({
            title: "请将活动信息填写完整",
          });
          return;
        }
        this.$store.commit("teacher/updateCourseHourInfo", {
          time: this.form.time,
          description: this.form.desc1,
        });
        const h = this.$createElement;
        // if (this.$store.state.nodes == []) {
        //   this.$info({
        //     title: "请注意先暂存事件",
        //   });
        // }
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
      this.componentId = "PreTeaching";
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
          node_contents: [
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
      this.componentId = "";
      this.modalvisible = false;
    },
    changesteps() {
      if (this.steps.length == 0) {
        this.$message.error("当前没有事件，请先添加事件");
        return;
      }
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
          node_contents: [
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
      if (this.steps.length == 0) {
        this.$message.error("当前没有事件，请先添加事件");
        return;
      }
      const that = this;
      this.$confirm({
        title: "确定删除此事件吗?",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          try {
            let time = that.steps[that.current].description.split("分钟")[0];
            that.sumtime -= time;
            console.log("that.steps[that.current]");
            console.log(that.steps[that.current]);
            if (that.steps[that.current].title === "讲课") {
              // 删除ppt
              that.$store.commit("teacher/updatePPT", {});
            }
            that.steps.splice(that.current, 1);
            that.$store.commit("teacher/deleteNode", that.current);

            that.current = that.steps.length - 1;
            that.addChange(that.current);
          } catch (err) {
            console.log(err);
          }
        },
        onCancel() {
          // console.log("Cancel");
        },
      });
    },
    tagChange(key) {
      switch (key) {
        case 0:
          (this.showTag = [true, false, false]), false;
          break;
        case 1:
          (this.showTag = [false, true, false]), false;
          break;
        case 2:
          this.showTag = [false, false, true, false];
          break;
        case 3:
          this.showTag = [false, false, false, true];
          break;
        default:
          break;
      }
    },
    judgeNodesBlank(nodes) {
      let judgeStatus = true;
      nodes.forEach((element1) => {
        if (
          element1.tag !== "Teach" &&
          element1.tag !== "Sign" &&
          element1.tag !== "randomSign"
        ) {
          element1.node_contents.forEach((element2) => {
            element2.options.forEach((item) => {
              if (item == "") {
                judgeStatus = false;
                return;
              }
            });
          });
        }
      });
      return judgeStatus;
    },
  },
  watch: {
    curCourseHour(value) {
      try {
        if (value == undefined) {
          return;
        }
        const type = {
          Vote: "投票",
          Sign: "签到",
          randomSign: "随机点名",
          Race: "抢答",
          Ask: "提问",
          Teach: "讲课",
          Test: "随堂测试",
          Dispatch: "文件下发",
        };
        this.current = 0;
        const { PPT, description, duration, name, nodes } = value;
        this.form.desc1 = description;
        // this.form.time = duration;
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
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.$store.dispatch("teacher/getSources", {
      lesson_id: this.lesson_id,
      teacher_id: this.uid,
    });
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
  background: #f9f0fa;
  height: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
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
.csp {
  height: 100%;
}
.cspH {
  margin-bottom: 10px;
  background: #f9f0fa;
  display: flex;
}
.cspH--tag {
  width: 100px;
  padding: 10px;
  font-size: 16px;
  color: #6d757a;
  /* border-bottom: 2px solid #ccc; */
  cursor: pointer;
}
.cspH--tag--default {
  color: #222222;
  border-bottom: 3px solid #ccc;
}
.cspH--tag:hover {
  width: 100px;
  padding: 10px;
  /* border-bottom: 2px solid #ccc; */
}
.cspC {
  height: 100%;
  /* background: #6d757ae6; */
  display: flex;
  flex-direction: column;
}
.cspC--tag {
  height: 100%;
}
</style>
<style></style>

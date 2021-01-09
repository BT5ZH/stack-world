<template>
  <a-row>
    <a-row style="padding-top: 20px" type="flex" justify="end">
      <a-col :pull="1" :span="2">
        <a-button @click="$router.push({ name: 'teacher_index' })" type="link">
          返回首页
        </a-button>
      </a-col>
    </a-row>
    <a-row style="padding-top: 50px">
      <a-col :span="15">
        <!-- 实时课堂 -->
        <a-row type="flex" justify="start">
          <a-col :span="6">
            <h2 class="block-title">
              <a href="#">实时课堂</a>
            </h2>
          </a-col>
        </a-row>
        <a-row style="height: 400px">
          <a-col :span="20" :push="2">
            <teacher-live></teacher-live>
          </a-col>
        </a-row>

        <!-- 课堂活动 -->
        <a-row type="flex" justify="start">
          <a-col :span="6">
            <h2 class="block-title">
              <a href="#">课堂活动</a>
            </h2>
          </a-col>
        </a-row>

        <a-row>
          <a-row type="flex" justify="center">
            <a-col :span="18">
              <div class="card-container">
                <a-row>
                  <span class="action-type">{{ steps[curEvent].title }}</span>
                </a-row>
                <a-row :gutter="20" class="card-body">
                  <a-col :span="18">
                    <h2>{{ steps[curEvent].desc }}</h2>
                  </a-col>
                  <a-col :span="2">
                    <a-button
                      shape="circle"
                      size="large"
                      @click="navigateToEvent(curEvent)"
                    >
                      <a-icon type="right-circle" style="font-size: 40px" />
                    </a-button>
                  </a-col>
                </a-row>
              </div>
            </a-col>
          </a-row>

          <a-row class="event-steps">
            <a-col :span="20" :push="2">
              <a-steps
                size="small"
                progress-dot
                v-model="curEvent"
                @change="eventChange"
              >
                <a-step
                  v-for="(step, index) in steps"
                  :key="index"
                  :title="step.title"
                  :description="step.time"
                />
              </a-steps>
            </a-col>
          </a-row>
        </a-row>
      </a-col>

      <a-col :span="9">
        <!-- 互动内容
      <a-row type="flex" justify="start">
        <a-col :span="6">
          <h2 class="block-title">
            <a href="#">互动内容</a>
          </h2>
        </a-col>
      </a-row>

      <a-row style="height: 400px">
        <a-empty> </a-empty>
      </a-row> -->

        <!-- 互动结果 -->
        <a-row type="flex" justify="start">
          <a-col :span="6">
            <h2 class="block-title">
              <a href="#">互动结果</a>
            </h2>
          </a-col>
        </a-row>
        <result></result>
      </a-col>
    </a-row>
  </a-row>
</template>

<script>
import * as socket from "@/utils/socket";
import axios from "@/utils/axios";
import { mapState } from "vuex";
import TeacherLive from "./Live";
import Result from "./Result";

export default {
  components: { TeacherLive, Result },
  data() {
    return {
      actionMap: {
        sign: { name: "签到", desc: "请同学们开始签到" },
        test: { name: "随堂测试", desc: "请同学们开始作答" },
        teach: { name: "讲课", desc: "讲课时间" },
        ask: { name: "提问", desc: "开始提问" },
        race: { name: "抢答", desc: "请同学们开始抢答" },
        vote: { name: "投票", desc: "请同学们开始投票" },
        dispatch: { name: "文件下发", desc: "请同学们查看文件" },
      },
      curEvent: 0,
    };
  },
  methods: {
    eventChange(value) {
      this.curEvent = value;
      this.$store.commit(
        "teacher/updateCurActivity",
        this.steps[this.curEvent].type
      );
    },
    navigateToEvent(eventIndex) {
      const event = this.steps[eventIndex];
      this[`send${event.type}Event`]();
    },
    sendsignEvent() {
      socket.sendEvent("joinRoom", {
        actionType: "sign",
        role: "teacher",
        roomId: this.lessonId,
      });
    },
    sendtestEvent() {
      socket.sendEvent("joinRoom", {
        actionType: "test",
        role: "teacher",
        roomId: this.lessonId,
        data: [
          {
            id: "YH83CP",
            stem: "中国传统佳节“中秋节”是那一天？",
            type: "subject",
            multiple: false,
            options: [
              "农历八月十五",
              "一月一日",
              "农历三月初七",
              "和龙舟节是一天",
            ],
          },
          {
            id: "1U7GVC0",
            stem: "操作系统的目标有哪些？",
            type: "subject",
            multiple: true,
            options: ["有效性", "开放性", "可扩充性", "方便性"],
          },
        ],
      });
    },
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
      nodes: (state) => state.teacher.precourse.nodes,
    }),
    steps() {
      if (!this.nodes) return [];
      return this.nodes.map((item) => ({
        type: item.tag.toLowerCase(),
        title: this.actionMap[item.tag.toLowerCase()].name,
        time: item.time,
        desc: this.actionMap[item.tag.toLowerCase()].desc,
      }));
    },
    events() {
      if (!this.nodes) return [];
      return this.nodes.map(({ vote }) => ({}));
    },
    lessonId() {
      return this.$route.query.lessonId;
    },
    courseHourName() {
      return this.$route.query.name;
    },
  },
  mounted() {
    const callback = (id) => {
      socket.sendEvent("joinRoom", {
        actionType: "enter",
        role: "teacher",
        roomId: this.lessonId,
        data: { teacherId: this.uid },
      });
      socket.sendEvent("public", {
        actionType: "classBegin",
        role: "teacher",
        data: { lessonId: this.lessonId, teacherId: this.uid },
      });
    };
    socket.createInstance("teacher", this, this.lessonId).then(callback);
    this.$store.dispatch("teacher/getTeacherPrepare", {
      teacher_id: this.uid,
      lesson_id: this.lessonId,
      name: this.courseHourName,
    });
  },
};
</script>

<style scoped>
.block-title {
  text-align: center;
  margin-right: 1.5rem;
  font-weight: bold;
}

.card-body h2 {
  padding: 20px 0;
  margin: 0 0 0 50px;
}

.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-container {
  margin: 10px 0;
  border-radius: 10px;
  height: 120px;
  box-shadow: 0 0 10px #ccc;
  /* box-shadow: 10px 10px 5px #888888; */
}

.action-type {
  padding: 5px 10px;
  background-color: #409eff;
  color: #fff;
}

.event-steps {
  padding: 50px 0 30px;
}
</style>
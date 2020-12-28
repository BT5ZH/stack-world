<template>
  <div>
    <h2 style="text-align: center; font-weight: bold">教师上课主页</h2>

    <a-row type="flex" justify="start">
      <a-col :span="6">
        <h2 style="text-align: center; margin-right: 1.5rem; font-weight: bold">
          <a href="#">正在进行 &gt;</a>
        </h2>
      </a-col>
    </a-row>

    <a-row>
      <a-row type="flex" justify="center">
        <a-col :span="22">
          <a-carousel
            arrows
            dots-class="slick-dots slick-thumb"
            ref="eventPanel"
          >
            <a-col :span="18" :push="2">
              <div class="card-container">
                <a-row>
                  <span class="action-type">{{ events[curEvent].name }}</span>
                </a-row>
                <a-row :gutter="20" class="card-body">
                  <a-col :span="18">
                    <h2>{{ events[curEvent].title }}</h2>
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
          </a-carousel>
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
              :description="step.description"
            />
          </a-steps>
        </a-col>
      </a-row>
    </a-row>

    <a-row type="flex" justify="start">
      <a-col :span="6">
        <h2 style="text-align: center; margin-right: 1.5rem; font-weight: bold">
          <a href="#">全部活动 &gt;</a>
        </h2>
      </a-col>
    </a-row>
    <a-row type="flex" align="middle" jusitfy="space-around">
      <a-col
        :span="6"
        class="action-btn"
        v-for="(action, index) in actions"
        :key="index"
      >
        <div class="drawer">
          <a-button
            :icon="action.icon"
            :style="{
              'background-color': colors[index],
              'border-color': colors[index],
            }"
            @click="actionClick(action.url, index)"
          ></a-button>
          <a-drawer
            placement="right"
            :visible="drawers[index]"
            :get-container="false"
            :wrap-style="{ position: 'absolute' }"
            :drawer-style="{ background: '#fafafa', width: '16rem' }"
            @close="onClose(index)"
          >
            <br />
            <br />
            <a-row type="flex" justify="end" align="bottom">
              <a-button type="primary" size="small" class="precourse"
                >备课内容</a-button
              >
              <!-- <a-icon type="plus-circle" style="font-size: 2.4rem;margin:0 1rem 0.3rem 0"></a-icon> -->
            </a-row>
            <!-- <a-row type="flex" justify="end">
              <a-icon type="plus-circle" style="font-size: 2.4rem;margin-right:1rem;"></a-icon>
            </a-row> -->
          </a-drawer>
        </div>
        <span>{{ action.title }}</span>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import * as socket from "@/utils/socket";
import axios from "@/utils/axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      actions: [
        { icon: "carry-out", title: "签到", url: "interaction_sign" },
        { icon: "bulb", title: "随堂提问", url: "interaction_ques" },
        { icon: "alert", title: "随机抽人", url: "interaction_pick" },
        { icon: "thunderbolt", title: "抢答", url: "interaction_race" },
        { icon: "hourglass", title: "随堂测试", url: "interaction_test" },
        { icon: "file-text", title: "文件下发", url: "interaction_file" },
        { icon: "like", title: "投票", url: "interaction_vote" },
      ],
      colors: [
        "#9FE6B8",
        "#FFDb5C",
        "#FF9F7F",
        "#F87293",
        "#8378EA",
        "#E7bCF3",
        "#96BFFF",
      ],
      drawers: [false, false, false, false, false, false, false],
      steps: [
        { title: "讲课", description: "20分钟" },
        { title: "提问", description: "5分钟" },
        { title: "提问", description: "5分钟" },
        { title: "提问", description: "5分钟" },
      ],
      curEvent: 0,
      events: [
        {
          name: "签到",
          title: "请大家开始签到",
          type: "sign",
        },
        {
          name: "随堂测试",
          title: "中国传统佳节“中秋节”是那一天？",
          type: "test",
        },
      ],
    };
  },
  methods: {
    actionClick(urlNamem, index) {
      this.drawers.splice(index, 1, true);
    },
    onClose(index) {
      this.drawers.splice(index, 1, false);
    },
    eventChange(value) {
      this.curEvent = value;
      this.$refs.eventPanel.next();
    },
    navigateToEvent(eventIndex) {
      const event = this.events[eventIndex];
      this[`send${event.type}Event`]();
      this.$router.push({
        name: `interaction_${event.type}`,
        query: {
          lessonId: this.lessonId,
        },
      });
    },
    sendsignEvent() {
      socket.sendEvent("joinRoom", {
        actionType: "sign",
        role: "teacher",
        roomId: this.lessonId,
      });
      this.$router.push({
        name: "interaction_sign",
        query: {
          lessonId: this.lessonId,
        },
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
    }),
    lessonId() {
      return this.$route.query.lessonId;
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
  },
};
</script>

<style scoped>
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
  width: 80%;
  height: 120px;
  box-shadow: 0 0 10px #ccc;
  /* box-shadow: 10px 10px 5px #888888; */
}

.action-type {
  padding: 5px 10px;
  background-color: #409eff;
  color: #fff;
}

.precourse {
  width: 5rem;
  height: 2rem;
  font-size: 0.8rem;
  color: #fff;
}

.drawer .ant-btn:not(.precourse) {
  width: 8rem;
  height: 8rem;
  font-size: 3rem;
  color: #fff;
}

.action-btn {
  padding-top: 12px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.drawer {
  height: 8rem;
  overflow: hidden;
  position: relative;
  margin-bottom: 1.5rem;
}

.event-steps {
  padding: 50px 0 30px;
}
</style>
<template>
  <div>
    <h2 style="text-align: center">教师上课主页</h2>

    <a-row type="flex" justify="start">
      <a-col :span="6">
        <h2 style="text-align: center; margin-right: 1.5rem">
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
                  <span class="action-type">{{ eventNames[curEvent] }}</span>
                </a-row>
                <a-row :gutter="20" class="card-body">
                  <a-col :span="18">
                    <h2>{{ eventTitles[curEvent] }}</h2>
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

      <a-row class="event-steps" type="flex" justify="center">
        <a-col :span="22">
          <a-steps
            size="small"
            progress-dot
            :current="curEvent"
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
        <h2 style="text-align: center; margin-right: 1.5rem">
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
      eventNames: ["投票", "文件下发", "签到"],
      eventTitles: ["热爱劳动手抄报大评比"],
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
      console.log("teacher send sign command");
      socket.sendEvent({
        roomId: "joinRoom",
        data: {
          actionType: "sign",
          role: "teacher",
          roomId: this.lessonId,
        },
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
    socket.createInstance(this, {}).then((id) => {
      socket.publicEvent({
        teacherId: this.uid,
        lessonId: this.lessonId,
      });
    });
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

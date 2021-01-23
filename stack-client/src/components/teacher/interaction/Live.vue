<template>
  <a-row class="container" :gutter="20">
    <a-col :span="15">
      <div class="live">
        <div id="local_stream"></div>
      </div>
    </a-col>
    <a-col :span="9">
      <div class="btn-area">
        <a-button @click="joinLiveRoom" type="primary">加入教室</a-button>
        <a-button @click="startLive" type="primary">开始授课</a-button>
        <a-button @click="closeLiveRoom" type="danger">结束授课</a-button>
      </div>
      <h3 align="center">教室成员列表</h3>
      <a-list
        item-layout="horizontal"
        :data-source="audienceList"
        :pagination="pagination"
      >
        <template #header>
          <h3>当前人数：{{ currentAudience }}</h3>
        </template>
        <template #renderItem="item">
          <a-list-item> {{ item.studentName }} </a-list-item>
        </template>
      </a-list>
    </a-col>
  </a-row>
</template>

<script>
import TRTC from "trtc-js-sdk";
import axios from "@/utils/axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      client: null,
      localStream: null,
      roomDisabled: false,
      liveDisabled: true,
      closeDiabled: true,
      pagination: {
        pageSize: 6,
      },
    };
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
      audienceList: (state) => state.teacher.onlineList,
    }),
    lessonId() {
      return this.$route.query.lessonId;
    },
    currentAudience() {
      return this.audienceList.length;
    },
  },
  methods: {
    getUserSig() {
      return axios
        .post("/pc/v1/activities/user_sig", {
          user_id: this.uid,
        })
        .then(({ data }) => {
          if (!data.userSig) throw "no sig in response";
          this.createClient(data.sdkAppId, data.userSig);
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("获取直播Token失败");
        });
    },
    createClient(sdkAppId, userSig) {
      this.client = TRTC.createClient({
        mode: "live",
        sdkAppId,
        userId: this.uid,
        userSig,
        useStringRoomId: true,
      });
    },
    joinLiveRoom() {
      let joinRoom = (client, roomId) => {
        client
          .join({ roomId, role: "anchor" })
          .catch((error) => {
            this.$notification.error({
              message: "温馨提示",
              description: "未能成功进入教室，请刷新后重试",
            });
          })
          .then(() => {
            // this.$notification.success({
            //   message: "温馨提示",
            //   description: "成功进入教室，系统正在播放您的声音",
            // });
            this.roomDisabled = true;
          });
      };
      if (!this.localStream) {
        this.createStream();
        this.getUserSig().then(() => {
          joinRoom(this.client, this.lessonId);
        });
      }
      joinRoom(this.client, this.lessonId);
    },
    createStream() {
      const localStream = TRTC.createStream({
        userId: this.uid,
        audio: true,
        video: true,
      });
      this.localStream = localStream;
      localStream
        .initialize()
        .catch((error) => {
          this.$message.error("找不到可用直播设备");
          // TODO give some tips
          //   switch (error.name) {
          //     case "NotReadableError":
          //       this.$message.error("找不到可用的音视频设备");
          //       break;
          //     default:
          //       console.error(error);
          //       break;
          //   }
        })
        .then(() => {
          console.log("初始化本地流成功");
          localStream.play("local_stream");
        });
    },
    closeLiveRoom() {
      this.$store.commit("teacher/clearOnlineList")
      this.client
        .leave()
        .then(() => {
          this.localStream.close();
          this.localStream = null;
          console.error("退房成功 ");
          // 退房成功，可再次调用client.join重新进房开启新的通话。
        })
        .catch((error) => {
          console.error("退房失败 " + error);
          // 错误不可恢复，需要刷新页面。
        });
    },
    startLive() {
      this.client
        .publish(this.localStream)
        .catch((error) => {
          console.error("本地流发布失败 " + error);
          this.$message.error("找不到可用直播设备");
        })
        .then(() => {
          this.$notification.success({
            message: "温馨提示",
            description: "成功进入教室，系统正在播放您的声音",
          });
          console.log("本地流发布成功");
          this.$message.info("可以观看直播啦");
        });
    },
    joinRoom() {},
  },
  mounted() {
    this.createStream();
    this.getUserSig();
    this.$store.dispatch("teacher/getOnlineStudents", this.lessonId);
  },
};
</script>

<style scoped>
.container {
  color: #fff;
  height: 100%;
}

/* h3,
ul li {
  color: #fff;
} */

.live {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

#local_stream div {
  background: #fff;
}

#local_stream {
  height: 400px;
}

.btn-area {
  display: flex;
  justify-content: space-between;
  padding-bottom: 40px;
}
</style>
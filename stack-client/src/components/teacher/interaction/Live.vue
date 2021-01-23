<template>
  <div class="interaction">
    <div class="live">
      <div class="live-header">
        <h2>实时课堂</h2>
      </div>

      <div id="local_stream"></div>
      <div class="btn-area">
        <a-button @click="joinLiveRoom" type="primary">加入教室</a-button>
        <a-button @click="startLive" type="primary">开始授课</a-button>
        <a-button @click="closeLiveRoom" type="danger">结束授课</a-button>
      </div>
    </div>

    <div class="onlineInfo">
      <div class="onlineInfo-header">
        <div class="onlineInfo-filter">成员列表</div>
        <div class="onlineInfo-arrow">当前{{ currentAudience }}人在线</div>
      </div>
      <div class="onlineInfo-body">
        <div class="onlineInfo-body-title">
          <div class="onlineInfo-body-title-text">姓名</div>
          <div class="onlineInfo-body-title-text">进入时间</div>
          <div class="onlineInfo-body-title-text">是否签到</div>
        </div>
        <div class="onlineInfo-body-list">循环在线名单</div>
      </div>
      <a-list item-layout="horizontal" :data-source="audienceList">
        <template #renderItem="item">
          <a-list-item> {{ item.studentName }} </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
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
      this.$store.commit("teacher/clearOnlineList");
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
    this.$store.commit("teacher/clearOnlineList");
    this.createStream();
    this.getUserSig();
    this.$store.dispatch("teacher/getOnlineStudents", this.lessonId);
  },
};
</script>

<style scoped>
.interaction {
  /* background-color: #f4f; */
  display: flex;
  justify-content: space-around;
}
.onlineInfo {
  width: 25%;
}
.onlineInfo .onlineInfo-header {
  display: flex;
  position: relative;
  height: 46px;
  width: 100%;
  background: #f4f4f4;
  color: #222;
  border-radius: 2px;
  box-sizing: border-box;
  cursor: pointer;
}
.onlineInfo .onlineInfo-body {
  box-sizing: border-box;
  overflow: hidden;
  margin: 0 5px;
}
.onlineInfo .onlineInfo-body .onlineInfo-body-title {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  position: relative;
  padding: 8px 0;
  overflow: hidden;
  z-index: 1;
  zoom: 1;
}
.onlineInfo .onlineInfo-body .onlineInfo-body-list {
  background-color: #fff;
  position: relative;
}
.onlineInfo .onlineInfo-header .onlineInfo-arrow {
  height: 14px;
  position: absolute;
  right: 14px;
  top: 0;
  bottom: 0;
  margin: auto;
  color: #505050;
}
.onlineInfo .onlineInfo-header .onlineInfo-filter {
  display: flex;
  position: relative;
  box-sizing: border-box;
  z-index: 2;
  height: 46px;
  line-height: 46px;
  border: none;
  border-radius: 2px;
  padding: 0 10px 0 16px;
  zoom: 1;
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
.live .live-header h2 {
  color: #1890ff;
  text-align: center;
  margin-right: 1.5rem;
  font-weight: bold;
}

#local_stream {
  height: 400px;
}

.btn-area {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>

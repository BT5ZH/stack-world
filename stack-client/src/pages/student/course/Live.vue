<template>
  <div class="live">
    <div id="remote_stream"></div>
    <div>
      <a-button @click="startLive" type="primary">加入房间</a-button>
      <a-button @click="subscribeStream" type="primary">订阅直播</a-button>
      <a-button @click="closeLive" type="danger">退出房间</a-button>
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
    };
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
    }),
    lessonId() {
      return this.$route.query.lessonId;
    },
  },
  methods: {
    initLiveClient() {
      axios
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
    startLive() {
      const roomId = this.lessonId;
      this.client
        .join({ roomId, role: "audience" })
        .catch((error) => {
          console.error("进房失败 " + error);
        })
        .then(() => {
          console.log("进房成功");
          this.subscribeStream();
        });
    },
    closeLive() {
      this.client
        .leave()
        .then(() => {
          console.error("退房成功 ");
          // 退房成功，可再次调用client.join重新进房开启新的通话。
        })
        .catch((error) => {
          console.error("退房失败 " + error);
          // 错误不可恢复，需要刷新页面。
        });
    },
    subscribeStream() {
      this.client.on("stream-added", (event) => {
        const remoteStream = event.stream;
        console.log("远端流增加: " + remoteStream.getId());
        //订阅远端流
        this.client.subscribe(remoteStream);
      });
      this.client.on("stream-subscribed", (event) => {
        const remoteStream = event.stream;
        console.log("远端流订阅成功：" + remoteStream.getId());
        // 播放远端流
        remoteStream.play("remote_stream");
      });
    },
  },
  mounted() {
    this.initLiveClient();
  },
};
</script>

<style scoped>
.live {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

#remote_stream {
  width: 50%;
  height: 500px;
  margin: 100px 0 20px 0;
}
</style>
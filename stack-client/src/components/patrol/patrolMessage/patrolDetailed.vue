<template>
  <div>
    <a href="#" class="quit" @click="$router.go(-1)">返 回</a>
    <div id="remote_stream">
      <div class="live_header font-white">
        <p @click="$router.go(-1)">&lt; 1201 文渊楼</p>
        <p>到课率：98.2%</p>
      </div>
    </div>
    <div class="rate_container">
      <div
        class="rate_sum font-white"
        :style="{ backgroundColor: startRate ? '#50b8ee' : '#ffbf35' }"
      >
        <div @click="startRate = !startRate">
          <a-icon type="form" />
          <span v-if="startRate"> 完成评价 </span>
          <span v-else> 开始评价 </span>
        </div>
        <p>总分：{{ sumScore }}</p>
      </div>
      <div class="rate_ques">
        <div class="ques_container" v-for="(item, index) in ques_list" :key="item.id">
          <p>{{ index + 1 }}、{{ item.content }}</p>
          <div class="icon-wrapper">
            <a-icon :style="{ color: preColor }" type="frown-o" />
            <a-slider
              :min="min"
              :max="max"
              :value="item.value"
              @change="handleChange"
              @afterChange="changeIndex(index)"
              :disabled="!startRate"
            />
            <a-icon :style="{ color: nextColor }" type="smile-o" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TRTC from "trtc-js-sdk";
import axios from "@/utils/axios";
import { mapState } from "vuex";
//总分5分，算分公式 [( ∑ item.value/5 )/题目数量 ] * 100
export default {
  data() {
    return {
      value: 0,
      min: 0,
      max: 10,
      startRate: false,
      ques_list: [
        {
          content:
            "何时使用呢？当用户需要在数值区间/自定义区间内进行选择时，可为连续或离散值",
          value: 0,
          id: 111,
        },
        {
          content:
            "何时使用呢？当用户需要在数值区间/自定义区间内进行选择时，可为连续或离散值",
          value: 0,
          id: 121,
        },
        {
          content:
            "何时使用呢？当用户需要在数值区间/自定义区间内进行选择时，可为连续或离散值",
          value: 0,
          id: 131,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      userId: (state) => state.public.uid,
    }),
    preColor() {
      const { max, min, value } = this;
      const mid = ((max - min) / 2).toFixed(5);
      return value >= mid ? "" : "rgba(0, 0, 0, .45)";
    },
    nextColor() {
      const { max, min, value } = this;
      const mid = ((max - min) / 2).toFixed(5);
      return value >= mid ? "rgba(0, 0, 0, .45)" : "";
    },
    sumScore() {
      const { max, ques_list } = this;
      let sum = 0;
      for (let i = 0; i < ques_list.length; i++) {
        sum += ques_list[i].value;
      }
      return ((sum / max / ques_list.length) * 100).toFixed(2);
    },
  },
  mounted() {
    // 初始化腾讯音视频
    this.initLiveClient();
  },
  methods: {
    initLiveClient() {
      axios
        .post("/pc/v1/activities/user_sig", {
          user_id: this.userId,
        })
        .then(({ data }) => {
          if (!data.userSig) throw "no sig in response";
          this.client = TRTC.createClient({
            mode: "live",
            sdkAppId: data.sdkAppId,
            userId: this.userId,
            userSig: data.userSig,
            useStringRoomId: true,
          });
          this.joinRoom();
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("获取直播Token失败");
        });
    },
    joinRoom() {
      this.client
        .join({ roomId: this.$route.query.lessonId, role: "audience" })
        .catch((error) => {
          console.error(error);
          this.$message.success("进入教室失败，请刷新后重试");
        })
        .then(() => {
          this.$message.success("成功进入教室");
          this.client.on("stream-added", (event) => {
            this.client.subscribe(event.stream);
          });
          this.client.on("stream-subscribed", (event) => {
            // 删除可能出现的多余播放器
            let player = document.getElementById("remote_stream");
            // console.log("player");
            // console.log(player);
            player.innerHTML = "";
            // 开始播放
            event.stream.play("remote_stream");
          });
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
    handleChange(value) {
      this.value = value;
    },
    changeIndex(index) {
      this.ques_list[index].value = this.value;
    },
    formatter(value) {
      return `${value}`;
    },
  },
};
</script>

<style scoped>
.quit {
  left: 100px;
}
#remote_stream {
  width: 40%;
  margin: auto;
  min-height: 300px;
  background-image: url("../../../assets/img/video/直播.png");
}

.font-white {
  color: #fff;
  font-size: 1.8rem;
  padding: 2rem 1.5rem 0;
  display: flex;
  justify-content: space-between;
}

.rate_container {
  width: 52%;
  margin: 2rem auto;
  padding-bottom: 3rem;
}

.rate_sum {
  border-radius: 6px;
  margin-bottom: 2rem;
}

.icon-wrapper {
  position: relative;
  padding: 0px 30px;
}

.icon-wrapper .anticon {
  position: absolute;
  top: -2px;
  width: 16px;
  height: 16px;
  line-height: 1;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.25);
}

.icon-wrapper .anticon:first-child {
  left: 0;
}

.icon-wrapper .anticon:last-child {
  right: 0;
}
</style>

<template>
  <body>
    <div class="container">
      <Header></Header>
      <div class="content">
        <scheduleCard></scheduleCard>
        <main class="container__item">
          <div>
            <a-divider
              orientation="left"
              style="padding: 2rem .8rem;margin: .8rem 0;"
            >
              学习中心
            </a-divider>
            <gridView4 :gridItems="courseMenu"></gridView4>
          </div>
          <div>
            <a-divider
              orientation="left"
              style="padding: 2rem .8rem;margin: .8rem 0;"
            >
              个人中心
            </a-divider>
            <gridView4 :gridItems="userMenu"></gridView4>
          </div>
        </main>
        <a-modal v-model="visible" title="Basic Modal" @ok="handleOk">
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </a-modal>
        <button @click="sendMessage">投票</button>
      </div>
    </div>
  </body>
</template>

<script>
import * as socket from "@/utils/socket";
import Header from "../../layout/HeaderAvatar.vue";
import scheduleCard from "../../components/student/ScheduleCard.vue";
import gridView4 from "../../layout/GridView4.vue";

import { mapState } from "vuex";
import { mapGetters } from "vuex";

export default {
  name: "StudentHomePage",
  components: {
    Header,
    scheduleCard,
    // chart,
    gridView4,
  },
  data() {
    return {
      voteSignal: "",
      voteSwitch: false,
      visible: false,
    };
  },
  computed: {
    ...mapState({
      courseMenu: (state) => state.student.courseMenu,
      userMenu: (state) => state.student.userMenu,
    }),
    ...mapGetters({
      lessonIdList: "lessonIdList",
    }),
  },
  watch: {
    voteSignal(item1, item2) {
      console.log("new" + item1);
      console.log("old" + item2);
    },
  },
  methods: {
    joinRoomActivity() {
      socket.createInstance(this, {
        joinRoom: (eventData) => {
          console.log(eventData.message);
          // this.voteSignal = eventData.message;
          // console.log("data" + this.voteSignal);
          // if (this.voteSignal == "vote") {
          //   this.visible = true;
          // }
        },
      });
    },
    sendMessage() {
      socket.sendEvent({
        type: "joinRoom",
        data: { roomId: "12345678", activityType: "sign" },
      });
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },
  },
  mounted() {
    socket.createInstance(this, {
      public: (data) => {
        const cb = (lesson) => (data.lessonId = lesson);
        const condition = this.lessonIdList.some(cb);
        if (!condition) return null;
        socket.sendEvent({
          roomId: "joinRoom",
          data: { activityType: "enter", data: { studentId: this.uid } },
        });
      },
      sign: (data) => {
        console.log("可以签到了", data);
        this.$store.commit("updateCourseSignFlag");
      },
    });
  },
};
</script>

<style lang="scss">
.headdd {
  color: aliceblue;
}
</style>

<template>
  <div style="padding: 2rem">
    <a-empty v-if="voteData.length" />
    <a-list v-else item-layout="vertical" size="large">
      <a-list-item v-for="(item, index) in voteData.questions" :key="index">
        <!-- <single-ques @submit="submitAnswer" :item="item"></single-ques> -->
        <div value="index">
          <p>{{ index }}.&nbsp;{{ item.content }}</p>
          <a-radio-group :name="`${item.id}_${index}`" @change="onChange">
            <a-radio
              :key="opt.value"
              v-for="(opt, oi) in item.options"
              :value="oi"
            >
              {{ opt.text }}
            </a-radio>
          </a-radio-group>
        </div>
      </a-list-item>
    </a-list>
    <a-button
      :disabled="disabled"
      @click="submitAnswer"
      style="margin-top: 20px"
      type="primary"
    >
      提交
    </a-button>
  </div>
</template>

<script>
import * as UTILS from "@/utils/utils";
import { mapState } from "vuex";

export default {
  props: {
    socket: {
      required: true,
    },
  },
  data() {
    return {
      disabled: false,
      answerList: [],
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
    };
  },
  computed: {
    ...mapState({
      voteData: (state) => state.student.interaction.vote,
      studentName: (state) => state.public.userName,
      studentId: (state) => state.public.studentId,
    }),
    lessonId() {
      return this.$route.query.lessonId;
    },
  },
  methods: {
    onChange(e) {
      let tempObj = {};
      let tempIndex = e.target.name.split("_")[1];
      let tempId = e.target.name.split("_")[0];
      let tempVal = e.target.value;
      tempObj.tempId = tempId;
      tempObj.tempVal = tempVal;

      this.answerList[tempIndex] = tempObj;
      // this.answerList.tempId = tempId;
      // this.answerList.tempVal = tempVal;
      // console.log("radio checked", e.target.value);
      // console.log("radio checked", e.target.name);
    },
    submitAnswer() {
      //获得当前东八区的时间，并赋值给 now
      let timeZone = 8;
      let offset_GMT = new Date().getTimezoneOffset();
      var nowDate = new Date().getTime();
      var now = new Date(
        nowDate + offset_GMT * 60 * 1000 + timeZone * 60 * 60 * 1000
      );

      const submitTime = UTILS.formatDate(now);

      let resultList = [];
      this.answerList.forEach((item, index) => {
        let voteAnswer = {};
        voteAnswer.voteSelection = item.tempVal;
        voteAnswer.voteIndex = index;
        voteAnswer.voteItemId = item.tempId;
        resultList.push(voteAnswer);
      });
      // console.log(resultList);
      this.socket.sendEvent("joinRoom", {
        actionType: "vote",
        role: "student",
        roomId: this.lessonId,
        studentId: this.studentId,

        data: {
          phaseIndex: this.voteData.phaseIndex,
          studentName: this.studentName,
          studentId: this.studentId,
          submitTime: submitTime,
          result_list: resultList,
        },
      });
         this.$store.commit("student/updateStudentBadge", {
        event: "vote",
        status: false,
      });
    },
  },
  mounted() {},
};
</script>

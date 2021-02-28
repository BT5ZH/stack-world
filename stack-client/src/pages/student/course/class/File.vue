<template>
  <div class="course_content" style="padding-top: 2rem">
    <a-empty v-if="fileData.fileList.length == 0" />
    <div v-else>
      <a-list size="small" bordered :data-source="fileData.fileList">
        <template #renderItem="item">
          <a-list-item>
            <a :href="item.url" target="_blink">{{ item.title }}</a>
          </a-list-item>
        </template>
      </a-list>
      <a-button
        :disabled="disabled"
        @click="submitAnswer"
        style="margin-top: 20px"
        type="primary"
      >
        确认
      </a-button>
    </div>
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
    return { disabled: false };
  },
  computed: {
    ...mapState({
      fileData: (state) => state.student.interaction.file,
      studentName: (state) => state.public.userName,
      studentId: (state) => state.public.studentId,
    }),
    lessonId() {
      return this.$route.query.lessonId;
    },
  },
  mounted() {},
  methods: {
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
      this.fileData.fileList.forEach((item, index) => {
        let fileAnswer = {};
        fileAnswer.fileId = "";
        fileAnswer.fileUrl = item.url;
        fileAnswer.fileName = item.title;
        resultList.push(fileAnswer);
      });

      this.socket.sendEvent("joinRoom", {
        actionType: "file",
        role: "student",
        roomId: this.lessonId,
        studentId: this.studentId,

        data: {
          phaseIndex: this.fileData.phaseIndex,
          studentName: this.studentName,
          studentId: this.studentId,
          submitTime: submitTime,
          result_list: resultList,
        },
      });
    },
  },
};
</script>

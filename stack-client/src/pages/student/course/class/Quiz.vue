<template>
  <div style="padding: 2rem">
    <a-empty v-if="testData.length" />
    <a-list v-else item-layout="vertical" size="large">
      <a-list-item v-for="(item, index) in testData.questions" :key="index">
        <single-ques
          @submit="submitAnswer"
          v-if="item.multiple"
          :item="item"
        ></single-ques>
        <multi-ques @submit="submitAnswer" v-else :item="item"></multi-ques>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import singleQues from "../../../../components/SingleQues.vue";
import multiQues from "../../../../components/MultiQues.vue";
import { mapState } from "vuex";
import * as socket from "@/utils/socket";

export default {
  props: {
    socket: {
      required: true,
    },
  },
  components: {
    singleQues,
    multiQues,
  },
  computed: {
    ...mapState({
      testData: (state) => state.student.interaction.test,
    }),
    lessonId() {
      return this.$route.query.lessonId;
    },
  },
  methods: {
    submitAnswer(data) {
      this.socket.sendEvent("joinRoom", {
        actionType: "test",
        role: "student",
        roomId: this.lessonId,
        data: data,
      });
    },
  },
  mounted() {
    socket.createInstance("student", this, this.lessonId);
  },
};
</script>
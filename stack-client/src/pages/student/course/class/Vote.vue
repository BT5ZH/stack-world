<template>
  <div style="padding: 2rem">
    <a-empty v-if="voteData.length" />
    <a-list v-else item-layout="vertical" size="large">
      <a-list-item v-for="(item, index) in voteData.questions" :key="index">
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
      voteData: (state) => state.student.interaction.vote,
    }),
    lessonId() {
      return this.$route.query.lessonId;
    },
  },
  methods: {
    submitAnswer(data) {
      this.socket.sendEvent("joinRoom", {
        actionType: "vote",
        role: "student",
        roomId: this.lessonId,
        data: data,
      });
    },
  },
  mounted() {},
};
</script>
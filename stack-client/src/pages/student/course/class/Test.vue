<template>
  <div style="padding: 2rem">
    <a-empty v-if="QuesData == null" />
    <a-list v-else item-layout="vertical" size="large">
      <a-list-item v-for="(item, index) in testData.questions" :key="index">
        <single-ques v-if="item.multiple" :item="item"></single-ques>
        <multi-ques v-else :item="item"></multi-ques>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import singleQues from "../../../../components/SingleQues.vue";
import multiQues from "../../../../components/MultiQues.vue";
import { mapState } from "vuex";

export default {
  components: {
    singleQues,
    multiQues,
  },
  computed: {
    ...mapState({
      testData: (state) => state.student.interaction.test,
    }),
  },
  methods: {},
  mounted() {},
};
</script>
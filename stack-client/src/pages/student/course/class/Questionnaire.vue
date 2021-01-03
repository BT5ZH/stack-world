<template>
  <div style="padding: 2rem;">
    <a-empty v-if="QuesData == null" />
    <a-list v-else item-layout="vertical" size="large">
      <a-list-item v-for="(item, index) in QuesData" :key="index">
        <single-ques v-if="item.answer.length == 1" :item="item"></single-ques>
        <multi-ques v-else :item="item"></multi-ques>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import singleQues from "../../../../components/SingleQues.vue";
import multiQues from "../../../../components/MultiQues.vue";

const QuesData = [];
for (let i = 0; i < 3; i++) {
  QuesData.push(
    {
      answer: ["A", "C"],
      content:
        "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
      options: [
        {
          value: "A",
          text: "aaa",
        },
        {
          value: "B",
          text: "bbb",
        },
        {
          value: "C",
          text: "ccc",
        },
        {
          value: "D",
          text: "ddd",
        },
      ],
    },
    {
      answer: ["A"],
      content:
        "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
      options: [
        {
          value: "A",
          text: "aaa",
        },
        {
          value: "B",
          text: "bbb",
        },
        {
          value: "C",
          text: "ccc",
        },
        {
          value: "D",
          text: "ddd",
        },
      ],
    }
  );
}
export default {
  components: {
    singleQues,
    multiQues,
  },
  data() {
    return {
      QuesData,
    };
  },
  methods: {},
};
</script>

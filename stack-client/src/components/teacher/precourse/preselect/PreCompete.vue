<template>
  <div class="container">
    <a-card :title="'抢答'" class="card">
      <template #extra>
        <a-row class="card-btn">
          <a-radio-group name="radioGroup" v-model="ifshow">
            <a-radio :value="1"> 主观题 </a-radio>
            <a-radio :value="2"> 单选题 </a-radio>
            <a-radio :value="3"> 多选题 </a-radio>
          </a-radio-group>
        </a-row>
      </template>
      <a-row :gutter="20">
        <a-col :span="ifshow !== 1 ? 14 : 24">
          <a-row class="title" type="flex" justify="space-between">
            <a-col :span="3">
              <h3>题目</h3>
            </a-col>
            <a-col :span="ifshow !== 1 ? 7 : 4">
              抢答人数：<a-input-number v-model="value" :min="1" :max="100" />
            </a-col>
          </a-row>
          <a-row style="height: 320px">
            <div id="editor"></div>
          </a-row>
        </a-col>
        <a-col :span="10" v-if="ifshow !== 1">
          <a-row class="title">
            <h3>问题选项</h3>
          </a-row>
          <a-row>
            <a-input
              v-for="index in optionlength"
              :key="index"
              class="options"
              v-model="cards.options[index - 1]"
            >
              <template #prefix>
                <a-button type="primary">{{ ENG_CHARS[index - 1] }}</a-button>
              </template>
              <template #suffix>
                <a-icon type="close" @click="closeOption(index - 1)"></a-icon>
              </template>
            </a-input>
            <a-row>
              <a-button type="primary" @click="optionlength++"
                >添加选项</a-button
              >
            </a-row>
          </a-row>
          <a-row class="title">
            <h3>正确答案</h3>
          </a-row>
          <a-row>
            <a-select
              placeholder="请输入正确答案"
              style="width: 200px"
              v-if="ifshow === 2"
              v-model="rightanswer"
            >
              <a-select-option v-for="index in optionlength" :key="index + ''">
                {{ ENG_CHARS[index - 1] }}
              </a-select-option>
            </a-select>
            <a-select
              mode="tags"
              placeholder="请输入正确答案"
              style="width: 200px"
              v-else
              v-model="rightanswer"
            >
              <a-select-option v-for="index in optionlength" :key="index + ''">
                {{ ENG_CHARS[index - 1] }}
              </a-select-option>
            </a-select>
          </a-row>
        </a-col>
      </a-row>
      <a-row type="flex" justify="end">
        <a-col>
          <a-button type="primary" @click="node_vote"> 暂存事件 </a-button>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import E from "wangeditor";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    const ENG_CHARS = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
    ];
    const MAX_OPTIONS = ENG_CHARS.length;
    return {
      value: 3,
      ifshow: 1,
      ENG_CHARS,
      MAX_OPTIONS,
      cards: { title: "", options: [] },
      optionlength: 2,
      rightanswer: "",
    };
  },
  methods: {
    node_vote() {
      const vote = [
        {
          options: this.cards.options,
          question_type: this.ifshow,
          right_answer: this.rightanswer,
          title: this.cards.title,
        },
      ];
      this.$store.commit("teacher/updateNodevote", vote);
      this.$store.commit("teacher/updatepeople_num", this.value);
    },
    closeOption(index) {
      if (this.optionlength <= 2) {
        this.$message.info("选项不能少于两个！");
        return null;
      }
      this.cards.options.splice(index, 1);
      this.optionlength--;
    },
    createEditor(selector, content) {
      const editor = new E(selector);
      editor.config.showFullScreen = false;
      editor.config.menus = [
        // "head",
        // "bold",
        // "fontSize",
        // "italic",
        // "underline",
        // "strikeThrough",
        // "lineHeight",
        // "foreColor",
        // "backColor",
        // "link",
        // "list",
        // "justify",
        // "image",
        // "video",
        // "code",
      ];
      editor.create();
      if (content) {
        editor.txt.html("<p>" + content + "</p>");
      }
    },
  },
  computed: {
    ...mapGetters({
      getCompete: "teacher/getCompete",
    }),
  },
  mounted() {
    this.cards = {
      title: this.getCompete.title,
      options: this.getCompete.options,
    };
    this.rightanswer = this.getCompete.rightanswer;
    this.ifshow = this.getCompete.ifshow;
    this.value = this.getCompete.value;
    this.optionlength = this.getCompete.options.length;
    this.$nextTick(() => {
      this.createEditor("#editor", this.cards.title);
    });
  },
};
</script>

<style scoped>
.card-btn .ant-btn {
  margin: 0 5px;
}

.title h3 {
  padding: 10px 0;
}

.options {
  padding-left: 30px;
  position: relative;
  right: 10px;
  margin-bottom: 20px;
}

.card {
  margin-bottom: 40px;
}
</style>
<template>
  <div class="container">
    <a-card :title="'提问'" class="card">
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
          <a-row class="title">
            <h3>题目</h3>
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
              <a-select-option
                v-for="index in optionlength"
                :key="ENG_CHARS[index - 1]"
              >
                {{ ENG_CHARS[index - 1] }}
              </a-select-option>
            </a-select>
            <a-select
              mode="tags"
              placeholder="请输入正确答案"
              style="width: 200px"
              v-else
              v-model="answer"
            >
              <a-select-option
                v-for="index in optionlength"
                :key="ENG_CHARS[index - 1]"
              >
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
      answer: [],
      ifshow: 1,
      ENG_CHARS,
      MAX_OPTIONS,
      cards: { title: "", options: [] },
      optionlength: 2,
      editor: null,
      rightanswer: "",
    };
  },
  computed: {
    ...mapGetters({
      getCompete: "teacher/getCompete",
    }),
  },
  methods: {
    node_vote() {
      try {
        if (this.ifshow === 3) {
          this.rightanswer = this.answer.join("");
        }
        const node_contents = [
          {
            options: this.cards.options,
            question_type: this.ifshow,
            right_answer: this.rightanswer,
            title: this["editor"].txt.text(),
          },
        ];
        this.$store.commit("teacher/updateNodeContents", node_contents);
        this.$message.info("暂存成功");
      } catch (err) {
        this.$message.error("暂存失败");
        console.log(err);
      }
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
      this["editor"] = editor;
      if (content) {
        editor.txt.html("<p>" + content + "</p>");
      }
    },
  },
  mounted() {
    this.cards = {
      title: this.getCompete.title,
      options: this.getCompete.options,
    };
    this.ifshow = this.getCompete.ifshow;
    this.rightanswer = this.getCompete.rightanswer;
    if (this.ifshow === 3) {
      this.answer = Array.from(this.rightanswer);
    }
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

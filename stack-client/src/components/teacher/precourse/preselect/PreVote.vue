<template>
  <div class="container">
    <a-card
      v-for="(card, idx) in cards"
      :key="idx"
      :title="'投票' + (idx + 1)"
      class="card"
    >
      <template #extra>
        <a-row class="card-btn">
          <a-button
            type="primary"
            shape="circle"
            icon="plus"
            @click="addCard"
          ></a-button>
          <a-button
            type="primary"
            shape="circle"
            icon="close"
            :disabled="cards.length <= 1"
            @click="closeCard(idx)"
          ></a-button>
        </a-row>
      </template>
      <a-row :gutter="20">
        <a-col :span="14">
          <a-row class="title">
            <h3>投票题目</h3>
          </a-row>
          <a-row style="height: 200px">
            <div :id="'editor' + idx"></div>
          </a-row>
        </a-col>
        <a-col :span="10">
          <a-row class="title">
            <h3>投票选项</h3>
          </a-row>
          <a-row>
            <a-input
              v-for="(value, index) in card.options"
              :key="index"
              class="options"
              v-model="card.options[index]"
            >
              <template #prefix>
                <a-button type="primary">{{ ENG_CHARS[index] }}</a-button>
              </template>
              <template #suffix>
                <a-icon
                  type="close"
                  @click="closeOption(idx, index - 1)"
                ></a-icon>
              </template>
            </a-input>
            <a-button type="primary" @click="addOption(idx)">添加选项</a-button>
          </a-row>
        </a-col>
      </a-row>
    </a-card>
    <a-row type="flex" justify="end">
      <a-col>
        <a-button type="primary" @click="node_vote"> 暂存事件 </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import E from "wangeditor";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    const ENG_CHARS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const MAX_OPTIONS = ENG_CHARS.length;
    return {
      ENG_CHARS,
      MAX_OPTIONS,
      cards: [],
      optionlength: [2],
    };
  },
  computed: {
    ...mapGetters({
      vote: "teacher/getVote",
    }),
  },
  mounted() {
    this.cards = this.vote;
    console.log(
      "🚀 ~ file: PreVote.vue ~ line 83 ~ mounted ~ this.cards",
      this.cards
    );
    this.$nextTick(() => {
      this.cards.forEach((item, index) => {
        this.createEditor("#editor" + index, index, item.title);
      });
    });
  },
  methods: {
    node_vote() {
      try {
        const node_contents = this.cards.map((item, index) => {
          return {
            options: item.options,
            question_type: null,
            right_answer: "",
            title: this["editor" + index].txt.text(),
          };
        });
        this.$store.commit("teacher/updateNodeContents", node_contents);
        this.$message.info("暂存成功");
      } catch (err) {
        this.$message.error("暂存失败");
        console.log(err);
      }
    },
    closeOption(idx, index) {
      if (this.cards[idx].options.length <= 2) {
        this.$message.info("选项不能少于两个！");
        return null;
      }
      this.cards[idx].options.splice(index + 1, 1);
      // let newlength = this.optionlength[idx] - 1;
      // this.optionlength.splice(idx, 1, newlength);
    },
    addOption(idx) {
      const length = this.cards[idx].options.length;
      if (length >= this.MAX_OPTIONS) {
        this.$message.info(`选项不能超过${this.MAX_OPTIONS}个！`);
        return null;
      }
      this.cards[idx].options.push("");
    },
    closeCard(idx) {
      this.cards.splice(idx, 1);
      this.optionlength.splice(idx, 1);
    },
    addCard() {
      this.cards.push({ title: "", options: [] });
      this.optionlength.push(2);
      const length = this.cards.length - 1;
      this.$nextTick(() => {
        const selector = "#editor" + length;
        this.createEditor(selector, length, "");
      });
    },
    createEditor(selector, index, content) {
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
      this["editor" + index] = editor;
      if (content) {
        editor.txt.html("<p>" + content + "</p>");
      }
    },
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

<style></style>

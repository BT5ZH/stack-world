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
          <!-- <a-button
            type="primary"
            shape="circle"
            icon="arrow-up"
            :disabled="idx <= 1"
            @click="riseUp(idx)"
          ></a-button>
          <a-button
            type="primary"
            shape="circle"
            icon="arrow-down"
            :disabled="idx >= cards.length - 1"
            @click="dropDown(idx)"
          ></a-button> -->
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
          <a-row style="height: 350px">
            <div :id="'editor' + idx"></div>
          </a-row>
        </a-col>
        <a-col :span="10">
          <a-row class="title">
            <h3>投票选项</h3>
          </a-row>
          <a-row>
            <a-input
              v-for="index in optionlength[idx]"
              :key="index"
              class="options"
              v-model="card.options[index - 1]"
            >
              <template #prefix>
                <a-button type="primary">{{ ENG_CHARS[index - 1] }}</a-button>
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
      <a-row type="flex" justify="end">
        <a-col>
          <a-button type="primary" @click="to_vuex"> 暂存到本地 </a-button>
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
    const ENG_CHARS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const MAX_OPTIONS = ENG_CHARS.length;
    return {
      ENG_CHARS,
      MAX_OPTIONS,
      cards: [],
      optionlength: [2],
    };
  },
  methods: {
    to_vuex() {},
    closeOption(idx, index) {
      if (this.optionlength[idx] <= 2) {
        this.$message.info("选项不能少于两个！");
        return null;
      }
      this.cards[idx].options.splice(index, 1);
      let newlength = this.optionlength[idx] - 1;
      this.optionlength.splice(idx, 1, newlength);
    },
    addOption(idx) {
      const length = this.optionlength[idx];
      if (length >= this.MAX_OPTIONS) {
        this.$message.info(`选项不能超过${this.MAX_OPTIONS}个！`);
        return null;
      }
      let newlength = this.optionlength[idx] + 1;
      this.optionlength.splice(idx, 1, newlength);
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
        this.createEditor(selector);
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
  computed: {
    ...mapGetters({
      Vote: "teacher/getVote",
    }),
  },
  mounted() {
    this.cards = this.Vote;
    this.$nextTick(() => {
      this.cards.forEach((item, index) => {
        this.createEditor("#editor" + index, index, item.title);
      });
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

<style>
@media only screen and (min-height: 800px) {
  .container {
    height: 600px;
    overflow-y: auto;
  }
}
@media only screen and (max-height: 799px) and(min-height: 600px) {
  .container {
    height: 400px;
    overflow-y: auto;
    background: #000;
  }
}

@media only screen and (max-height: 599px) {
  .container {
    height: 300px;
    overflow-y: auto;
  }
}
</style>
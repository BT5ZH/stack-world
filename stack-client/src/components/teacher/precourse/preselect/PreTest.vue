<template>
  <a-card title="随堂测试" class="setcard">
    <a-row>
      <a-button @click="selectvisible = true"
        ><a-icon type="plus" />从资源库选题</a-button
      >
    </a-row>
    <br />
    <a-row>
      <a-card style="padding: 10px">
        <a-list :data-source="selectedsource" v-if="selectedsource.length">
          <a-list-item slot="renderItem" slot-scope="item, index" :id="index">
            <span>
              {{ index + 1 }}. {{ item.stem }} |
              {{ item.multiple | multipleFormatter }}
            </span>
            <template #extra>
              <a-button-group>
                <a-button size="small" type="link" @click="showit(item)"
                  >查看</a-button
                >
              </a-button-group>
            </template>
          </a-list-item>
        </a-list>
        <a-empty v-else />
      </a-card>
    </a-row>
    <a-modal
      title="选择题目"
      v-model="selectvisible"
      :zIndex="10001"
      width="40%"
    >
      <a-list :data-source="source">
        <a-list-item slot="renderItem" slot-scope="item, index" :id="index">
          <a-list-item-meta>
            <template #title>
              <a-checkbox
                :checked="item.selected"
                @change="onChange(item)"
              ></a-checkbox>
              <span>
                {{ index + 1 }}. {{ item.stem }} |
                {{ item.multiple | multipleFormatter }}
              </span>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
      <a-row type="flex" justify="center">
        <a-pagination
          class="pagination"
          :total="source.length"
          :show-size-changer="true"
          :show-quick-jumper="true"
        ></a-pagination>
      </a-row>
      <template #footer>
        <a-button type="primary" @click="selectsource"> 确定 </a-button>
      </template>
    </a-modal>
    <a-modal title="查看题目" v-model="showvisible" :zIndex="10001" width="40%">
      <a-row class="title">
        <h3>{{ question.stem }}</h3>
        <br />
      </a-row>
      <a-row>
        <a-input
          v-for="(item, index) in question.option"
          :key="index"
          class="options"
          :disabled="true"
          :value="item"
        >
          <template #prefix>
            <a-button type="primary">{{ index | charFormatter }}</a-button>
          </template>
        </a-input>
      </a-row>
      <a-row> 正确答案：{{ question.answer }} </a-row>
    </a-modal>
    <br />
    <a-row type="flex" justify="end">
      <a-col>
        <a-button type="primary" @click="node_vote"> 暂存事件 </a-button>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
const source = [
  {
    stem: "下列选项正确的是",
    option: ["王晓瀑是个二傻子", "王晓瀑同志很Nice"],
    answer: "AB",
    multiple: true,
    selected: false,
  },
  {
    stem: "下列选项错误的是",
    option: ["", "B"],
    answer: "A",
    multiple: false,
    selected: false,
  },
  {
    stem: "下列选项正确的是",
    option: ["A", "B"],
    answer: "A",
    multiple: false,
    selected: false,
  },
  {
    stem: "下列选项错误的是",
    option: ["A", "B"],
    answer: "A",
    multiple: false,
    selected: false,
  },
];
export default {
  data() {
    return {
      selectvisible: false,
      source,
      showvisible: false,
      question: {},
    };
  },
  computed: {
    selectedsource() {
      return this.source.filter((item) => item.selected);
    },
  },
  methods: {
    node_vote() {
      // const vote = [
      //   {
      //     options: this.cards.options,
      //     question_type: this.ifshow,
      //     right_answer: this.rightanswer,
      //     title: this.cards.title,
      //   },
      // ];
      // this.$store.commit("teacher/updateNodevote", vote);
    },
    selectsource() {
      this.selectvisible = false;
    },
    onChange(course) {
      course.selected = !course.selected;
    },
    showit(item) {
      this.showvisible = true;
      this.question = item;
    },
    deleteit(item) {
      item.selected = !item.selected;
    },
  },
  filters: {
    charFormatter(index) {
      return String.fromCharCode(65 + index);
    },
    multipleFormatter(multiple) {
      return multiple ? "多选题" : "单选题";
    },
  },
};
</script>
<style scoped>
.options {
  padding-left: 30px;
  position: relative;
  right: 10px;
  margin-bottom: 20px;
}
</style>
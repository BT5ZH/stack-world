<template>
  <a-card title="随堂测试" class="setcard">
    <a-row>
      <a-button @click="get_source_list"
        ><a-icon type="plus" />从资源库选题</a-button
      >
    </a-row>
    <br />
    <a-row>
      <a-card style="padding: 10px">
        <a-list :data-source="selectedsource" v-if="selectedsource.length">
          <a-list-item slot="renderItem" slot-scope="item, index" :id="index">
            <span v-if="item.type === 'wenzi'">
              {{ index + 1 }}.{{ item.stem }}({{
                item.multiple | multipleFormatter
              }})
            </span>
            <a :href="item.url" target="_blink" v-else>
              <span>
                {{ index + 1 }}.题目为图片({{
                  item.multiple | multipleFormatter
                }})
              </span>
            </a>
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
      width="60%"
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
                ({{ item.multiple | multipleFormatter }}){{ index + 1 }}.
                {{ item.stem }}
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
        <h3 v-if="question.type === 'wenzi'">{{ question.stem }}</h3>
        <img v-else :src="question.item" alt="题目" />
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
      <br />
      <a-row> 类型：{{ question.multiple | multipleFormatter }} </a-row>
      <br />
      <a-row> 难度：{{ question.grade }} </a-row>
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
import axios from "@/utils/axios";
import classlistVue from "../../coursedetail/class/classlist.vue";
export default {
  data() {
    return {
      selectvisible: false,
      source: [],
      showvisible: false,
      question: {},
    };
  },
  computed: {
    selectedsource() {
      return this.source.filter((item) => item.selected);
    },
    lesson_id() {
      return this.$route.query.lessonId;
    },
    teacher_id() {
      return this.$store.state.public.uid;
    },
  },
  methods: {
    get_source_list() {
      this.selectvisible = true;
    },
    node_vote() {
      const vote = this.selectedsource.map((item, index) => {
        return {
          options: item.option,
          question_type: item.multiple ? 3 : 2,
          right_answer: item.answer,
          title: item.id,
        };
      });
      this.$store.commit("teacher/updateNodevote", vote);
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
  mounted() {
    this.$store
      .dispatch("teacher/getquestionBank", {
        lesson_id: this.lesson_id,
        teacher_id: this.teacher_id,
      })
      .then(() => {
        let selected_IdList = this.$store.getters["teacher/getTest"];
        this.source = this.$store.getters["teacher/getQuestionList"].map(
          (item) => ({
            ...item,
            selected: selected_IdList.some((id) => id === item.id),
          })
        );
      });
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

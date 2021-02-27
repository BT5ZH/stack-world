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
        <a-list :data-source="cards" v-if="cards.length">
          <a-list-item slot="renderItem" slot-scope="item, index" :id="index">
            <span> {{ index + 1 }}.{{ item.title }} </span>
            <!-- <span v-if="item.type === 'wenzi'">
              {{ index + 1 }}.{{ item.stem }}({{
                item.multiple | multipleFormatter
              }})
            </span> -->
            <!-- <a :href="item.url" target="_blink" v-else>
              <span>
                {{ index + 1 }}.题目为图片({{
                  item.multiple | multipleFormatter
                }})
              </span> -->
            <!-- </a> -->
            <template #extra>
              <a-button-group>
                <a-button size="small" type="link" @click="showit(item)"
                  >查看</a-button
                >
                <a-button size="small" type="link" @click="deleteit(item)"
                  >删除</a-button
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
      <a-list :data-source="source" :pagination="pagination">
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
      <template #footer>
        <a-button type="primary" @click="selectsource"> 确定 </a-button>
      </template>
    </a-modal>

    <!-- 查看-->
    <a-modal
      title="查看题目"
      v-model="showvisible"
      :zIndex="10001"
      width="40%"
      @ok="showvisible = false"
    >
      <!-- v-if="question.type === 'wenzi'" -->
      <a-row class="title">
        <h3>{{ question.title }}</h3>
        <!-- <img v-else :src="question.item" alt="题目" /> -->
        <br />
      </a-row>
      <a-row>
        <a-input
          v-for="(item, index) in question.options"
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
      <a-row> 正确答案：{{ question.right_answer }} </a-row>
      <br />
      <a-row> 类型：{{ question.multiple | multipleFormatter }} </a-row>
      <br />
      <a-row>
        难度： <a-tag v-if="question.grade === 1" color="#87d068">简单 </a-tag>
        <a-tag v-else-if="question.grade === 2" color="#2db7f5">适中 </a-tag>
        <a-tag v-else color="#f50">困难</a-tag>
      </a-row>
      <br />
      <a-row>
        关键字：
        <a-tag
          color="blue"
          v-for="(item, index) in question.key_word"
          :key="index"
        >
          {{ item }}
        </a-tag>
      </a-row>
      <br />
      <a-row>
        知识点：
        <a-tag
          color="blue"
          v-for="(item, index) in question.knowledge"
          :key="index"
        >
          {{ item }}
        </a-tag>
      </a-row>
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
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      pagination: {
        pageSize: 5,
        showQuickJumper: true,
      },
      selectvisible: false,

      /* 存在于
         所有可以选择的试题
       */
      source: [],

      /* 存在于nodes->node_contents里的（已经存在于prepareLesson里的）
          用于在当前页面显示
       */
      cards: [],
      showvisible: false,
      question: {},
    };
  },
  computed: {
    ...mapGetters({
      test: "teacher/getTest",
    }),
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
      try {
        const node_contents = this.selectedsource.map((item, index) => {
          return {
            options: item.option,
            question_type: item.multiple ? 3 : 2,
            right_answer: item.answer,
            title: item.stem,
          };
        });
        this.$store.commit("teacher/updateNodeContents", node_contents);
        this.$message.info("暂存成功");
      } catch (err) {
        this.$message.error("暂存失败");
        console.log(err);
      }
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
    this.cards = this.test;
    this.$store
      .dispatch("teacher/getquestionBank", {
        lesson_id: this.lesson_id,
        teacher_id: this.teacher_id,
      })
      .then(() => {
        this.source = this.$store.getters["teacher/getQuestionList"];
        //   .map(
        //     (item) => ({
        //       ...item,
        //       selected: selected_IdList.some((id) => id === item.id),
        //     })
        //   );
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

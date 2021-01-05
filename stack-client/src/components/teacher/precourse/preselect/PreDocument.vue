<template>
  <a-card title="文件下发" class="setcard">
    <a-modal
      title="选择资源"
      v-model="selectvisible"
      @ok="selectsource"
      :zIndex="10001"
      width="40%"
    >
      <a-row>
        <a-list :data-source="sources">
          <template #renderItem="sourse">
            <a-list-item>
              <a-list-item-meta>
                <template #title>
                  <a-checkbox
                    :checked="sourse.selected"
                    @change="onChange(sourse)"
                  ></a-checkbox>
                  <img
                    slot="cover"
                    alt="example"
                    :src="sourse.src"
                    style="margin: 2px"
                    width="30px"
                    height="30px"
                  />
                  <a :href="sourse.url" target="_blink">{{
                    sourse.courseName
                  }}</a>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-row>
      <a-row type="flex" justify="center">
        <a-pagination
          class="pagination"
          :total="sources.length"
          :page-size="5"
          :show-quick-jumper="true"
        ></a-pagination>
      </a-row>
      <template #footer>
        <a-button type="primary" @click="selectsource"> 确定 </a-button>
      </template>
    </a-modal>
    <a-row type="flex" align="middle" justify="start" :gutter="10">
      <a-col>
        <a-button @click="selectvisible = true"
          ><a-icon type="plus" />从资源库选择</a-button
        >
      </a-col>
      <a-col>
        <span> 可上传视频,word,pdf,excel,图片等 </span>
      </a-col>
    </a-row>
    <br />
    <a-row>
      <a-card style="padding: 10px">
        <a-list :data-source="selectedsource" v-if="selectedsource.length">
          <a-list-item slot="renderItem" slot-scope="item, index" :id="index">
            <span>
              {{ index + 1 }}.
              {{ item.courseName }}
            </span>
            <template #extra>
              <a-button-group>
                <a-button
                  icon="delete"
                  size="small"
                  type="link"
                  @click="deleteit(item)"
                ></a-button>
              </a-button-group>
            </template>
          </a-list-item>
        </a-list>
        <a-empty v-else />
      </a-card>
    </a-row>
    <br />
    <a-row type="flex" justify="end">
      <a-col>
        <a-button type="primary" @click="node_vote"> 暂存事件 </a-button>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { mapState } from "vuex";
const sources = [];
export default {
  data() {
    return {
      sources,
      selectvisible: false,
    };
  },
  computed: {
    selectedsource() {
      return this.sources.filter((item) => item.selected);
    },
    ...mapState({
      uid: (state) => state.public.uid,
    }),
    lesson_id() {
      return this.$route.query.lessonId;
    },
  },
  methods: {
    node_vote() {
      const vote = this.selectedsource.map((item, index) => {
        return {
          options: item.courseId,
          question_type: null,
          right_answer: "",
          title: "",
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
    deleteit(item) {
      item.selected = !item.selected;
    },
    getResourceIconUrl(rsType) {
      let iconMap = new Map([
        [["mp4"], "video"],
        [["zip", "rar", "7z", "tar", "gz"], "zip"],
        [["doc", "docx"], "word"],
        [["txt"], "txt"],
        [["psd"], "psd"],
        [["ppt", "pptx"], "ppt"],
        [["png"], "png"],
        [["pdf"], "pdf"],
        [["mp3", "wma", "aac", "wav"], "mp3"],
        [["jpeg", "jpg"], "jpg"],
        [["html"], "html"],
        [["gif"], "gif"],
        [["xlsx", "xls"], "excel"],
      ]);
      for (let [suffix, iconName] of iconMap.entries()) {
        if (suffix.some((item) => item === rsType)) {
          return iconName;
        }
      }
      return "white";
    },
  },
  mounted() {
    this.$store
      .dispatch("teacher/getSources", {
        lesson_id: this.lesson_id,
        teacher_id: this.uid,
      })
      .then(() => {
        this.sources = this.$store.getters["teacher/getSources"].map((item) => {
          let src = this.getResourceIconUrl(item.type);
          return {
            courseId: item.courseId,
            courseName: item.courseName + "." + item.type,
            selected: false,
            url: item.url,
            src: require("@/assets/img/SVGS/" + src + ".svg"),
          };
        });
      });
  },
};
</script>
<style>
.ant-card-body {
  padding: 20px;
}
</style>
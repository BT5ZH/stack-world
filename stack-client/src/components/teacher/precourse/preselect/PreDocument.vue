<template>
  <a-card title="文件下发" class="setcard">
    <a-row type="flex" align="middle" juestify="center" style="padding: 5px">
      <a-space size="large">
        <a-col>
          <a-button @click="selectvisible = true"
            ><a-icon type="plus" />从资源库选择</a-button
          >
        </a-col>
        <a-modal
          title="选择资源"
          v-model="selectvisible"
          @ok="selectsource"
          :zIndex="10001"
          width="80%"
        >
          <a-row class="cards-area" :gutter="30">
            <a-col :span="6" v-for="(course, index) in sources" :key="index">
              <a-card style="margin-top: 15px" size="small">
                <a slot="extra">
                  <a-checkbox
                    :checked="course.selected"
                    @change="onChange(course)"
                  ></a-checkbox>
                </a>
                <img
                  slot="cover"
                  alt="example"
                  :src="course.src"
                  width="100px"
                  height="80px"
                />
                <h3>{{ course.courseName }}</h3>
                <br />
                <!-- <div>
                  <template v-for="tag in course.tags">
                    <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                      <a-tag :key="tag">
                        {{ "${tag.slice(0, 100)}..." }}
                      </a-tag>
                    </a-tooltip>
                    <a-tag v-else :key="tag">
                      {{ tag }}
                    </a-tag>
                  </template>
                </div> -->
              </a-card>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center">
            <a-pagination
              class="pagination"
              :total="sources.length"
              :show-size-changer="true"
              :show-quick-jumper="true"
            ></a-pagination>
          </a-row>
          <template #footer>
            <a-button type="primary" @click="selectppt"> 确定 </a-button>
          </template>
        </a-modal>
        <a-col>
          <p>可上传视频,word,pdf,excel,图片等</p>
        </a-col>
      </a-space>
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
        <a-button type="primary" @click="node_vote"> 暂存到本地 </a-button>
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
        console.log(suffix);
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
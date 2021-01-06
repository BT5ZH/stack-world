<template>
  <a-row>
    <a-row type="flex" justify="space-between">
      <a-col :span="5">
        <a-input-search
          placeholder="名称、标签"
          enter-button
          v-model="inputValue"
          @search="onSearch"
        />
      </a-col>
      <a-col :span="2">
        <a-button type="primary" @click="localVisible = true">
          本地上传
        </a-button>
      </a-col>
    </a-row>

    <a-row class="cards-area" :gutter="30">
      <a-col :span="4" v-for="(source, index) in sourceList" :key="index">
        <a-card style="margin-top: 15px" size="small">
          <template #title>
            <img
              slot="cover"
              alt="example"
              :src="source.src"
              width="40px"
              height="40px"
            />
            <span>{{ source.sourceName }}</span>
          </template>

          <template #extra>
            <a-checkbox @change="onChange"></a-checkbox>
          </template>

          <template v-if="source.tags.length">
            <span v-for="tag in source.tags" :key="tag">
              <a-tag color="#2db7f5" :key="tag" style="margin: 6px">
                {{ tag }}
              </a-tag>
            </span>
          </template>

          <template v-else>
            <p align="center">暂无标签</p>
          </template>

          <template #actions class="ant-card-actions">
            <a-button type="link">编辑</a-button>
            <a-button type="link" @click="download(source)">查看</a-button>
            <!-- <a-button type="link">删除</a-button> -->
          </template>
        </a-card>
      </a-col>
    </a-row>

    <a-row type="flex" justify="start" style="margin-top: 50px">
      <a-pagination
        class="pagination"
        :total="sourceList.length"
        :show-quick-jumper="true"
      ></a-pagination>
    </a-row>

    <local :visible.sync="localVisible"></local>
  </a-row>
</template>

<script>
import Local from "./Local";
import { mapState, mapGetters } from "vuex";

export default {
  components: { Local },
  data() {
    return {
      inputVisible: false,
      inputValue: "",
      localVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      resourceList: "teacher/resourceList",
    }),
    ...mapState({
      uid: (state) => state.public.uid,
    }),
    lessonId() {
      return this.$route.query.lessonId;
    },
    sourceList() {
      if (!this.resourceList) return [];
      let temp = this.resourceList.map((item) => {
        let src = this.getResourceIconUrl(item.rsType);
        return {
          ...item,
          sourceName: `${item.sourceName}.${item.rsType}`,
          src: require("@/assets/img/SVGS/" + src + ".svg"),
        };
      });
      if (!this.inputValue) return temp;
      return temp.filter(
        (item) =>
          item.sourceName.includes(this.inputValue) ||
          item.tags.some((tag) => tag.includes(this.inputValue))
      );
    },
  },
  methods: {
    onChange(e) {
      console.log(`checked = ${e.target.checked}`);
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
    onSearch() {},
    download(source) {
      // setTimeout(() => {
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = source.sourceName;
      a.target = "_blank";
      a.href = source.url;
      a.dispatchEvent(event);
      // }, 1000);
    },
  },
  mounted() {
    this.$store.dispatch("teacher/getSources", {
      teacher_id: this.uid,
      lesson_id: this.lessonId,
    });
  },
};
</script>

<style scoped>
</style>

<style>
.ant-upload {
  padding: 90px;
}
</style>
<template>
  <a-row>
    <a-row class="cards-area" :gutter="30">
      <a-table
        :columns="columns"
        :data-source="sourceList"
        bordered
        :pagination="{
          total: sourceList.length,
          pageSize: 2,
          'hide-on-single-page': true,
          'show-quick-jumper': true,
        }"
        rowKey="sourceId"
      >
        <template #tags="tags">
          <a-tag v-for="(item, index) in tags" :key="index" color="#2db7f5">
            {{ item }}
          </a-tag>
        </template>
        <template #operation="record">
          <a-button type="link" @click="download(record)">查看</a-button>
        </template>
      </a-table>
      <!-- <a-col :span="4" v-for="(source, index) in sourceList" :key="index">
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
            <a-button type="link" @click="download(source)">查看</a-button>
          </template>
        </a-card>
      </a-col> -->
    </a-row>

    <!-- <a-row type="flex" justify="start" style="margin-top: 50px">
      <a-pagination
        class="pagination"
        :total="sourceList.length"
        :pageSize="pageSize"
        hideOnSinglePage="true"
        @change="pageChange"
      ></a-pagination>
    </a-row> -->
  </a-row>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    const columns = [
      {
        title: "资源名",
        align: "center",
        dataIndex: "sourceName",
        ellipsis: true,
        width: "30%",
      },
      {
        title: "资源类型",
        dataIndex: "rsType",
        align: "center",
        width: "10%",
      },
      {
        title: "关键字",
        dataIndex: "tags",
        scopedSlots: { customRender: "tags" },
        align: "center",
        width: "30%",
      },
      {
        title: "操作",
        align: "center",
        scopedSlots: { customRender: "operation" },
      },
    ];
    return {
      columns,
      inputVisible: false,
      inputValue: "",
      localVisible: false,
      curPage: 1,
      pageSize: 6,
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
      let pageEnd = this.curPage * this.pageSize;
      let pageStart = pageEnd - this.pageSize;

      let temp = this.resourceList.map((item) => {
        let src = this.getResourceIconUrl(item.rsType);
        return {
          ...item,
          sourceName: `${item.sourceName}.${item.rsType}`,
          src: require("@/assets/img/SVGS/" + src + ".svg"),
        };
      });
      if (!this.inputValue) return temp.slice(pageStart, pageEnd);
      return temp
        .filter(
          (item) =>
            item.sourceName.includes(this.inputValue) ||
            item.tags.some((tag) => tag.includes(this.inputValue))
        )
        .slice(pageStart, pageEnd);
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
    download(source) {
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = source.sourceName;
      a.target = "_blank";
      a.href = source.url;
      a.dispatchEvent(event);
    },
    pageChange(page, pageSize) {
      this.curPage = page;
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
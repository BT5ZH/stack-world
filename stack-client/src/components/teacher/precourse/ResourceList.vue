<template>
  <a-row>
    <a-row class="cards-area" :gutter="30">
      <a-table
        :columns="columns"
        :data-source="sourceList"
        bordered
        :pagination="{
          total: sourceList.length,
          pageSize: 10,
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
          <a-button type="link" @click="rename(record)">重命名</a-button>
        </template>
      </a-table>
    </a-row>

    <a-modal title="修改资源名" @ok="submitRename" v-model="modifyVisible">
      <a-input v-model="resourceName" placeholder="请输入资源名"></a-input>
    </a-modal>
  </a-row>
</template>

<script>
import axios from "@/utils/axios";
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
        filters: [
          {
            text: "ppt",
            value: "ppt",
          },
          {
            text: "png",
            value: "png",
          },
          {
            text: "pptx",
            value: "pptx",
          },
          {
            text: "pdf",
            value: "pdf",
          },
          {
            text: "mp4",
            value: "mp4",
          },
          {
            text: "doc",
            value: "doc",
          },
          {
            text: "jpeg",
            value: "jpeg",
          },
          {
            text: "jpg",
            value: "jpg",
          },
          {
            text: "docx",
            value: "docx",
          },
          {
            text: "zip",
            value: "zip",
          },
        ],
        onFilter: (value, record) => record.rsType == value,
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
      modifyVisible: false,
      curPage: 1,
      pageSize: 50,
      resourceName: "",
      resourceId: "",
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
          sourceName: `${item.sourceName}`,
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
    rename(source) {
      this.resourceName = source.sourceName;
      this.resourceId = source.sourceId;
      this.modifyVisible = true;
    },
    submitRename() {
      axios
        .post("/pc/v1/resources/modifyProperities", {
          resourceId: this.resourceId,
          name: this.resourceName,
          // 可在此处添加 tags，进行 tags 的修改
          // tags: [],
        })
        .then(({ data }) => {
          if (data.status === "success") {
            this.$message.success("修改成功");
            this.modifyVisible = false;
            this.getSources();
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("修改信息失败");
        });
    },
    getSources() {
      this.$store.dispatch("teacher/getSources", {
        teacher_id: this.uid,
        lesson_id: this.lessonId,
      });
    },
  },
  mounted() {
    this.getSources();
  },
};
</script>

<style scoped></style>

<style>
.ant-upload {
  padding: 90px;
}
</style>

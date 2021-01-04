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
                <div>
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
                </div>
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
        </a-modal>
        <!-- <a-col>
          <a-button @click="visible = true"
            ><a-icon type="plus" />本地上传</a-button
          >
        </a-col>
        <a-modal
          @cancel="visible = false"
          @ok="uploadFile"
          :maskClosable="false"
          :confirm-loading="confirmLoading"
          centered
          width="40%"
          :closable="false"
          :destroyOnClose="true"
          v-model="visible"
        >
          <a-form-model
            :model="fileForm"
            ref="fileForm"
            labelAlign="left"
            :rules="formRules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-model-item label="资源名称" prop="name">
              <a-input
                placeholder="请输入资源名称"
                v-model="fileForm.name"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item label="资源标签" prop="tags">
              <a-input
                placeholder="请输入标签名，用 - 隔开"
                v-model="fileForm.tags"
              ></a-input>
            </a-form-model-item>
          </a-form-model>
          <a-upload-dragger
            :multiple="true"
            :before-upload="fileInput"
            :file-list="fileList"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">点击或拖拽以上传资源文件</p>
            <p class="ant-upload-hint">
              支持 docx、xlsx、ppt 等文档类型，音视频资源。
            </p>
          </a-upload-dragger>
        </a-modal> -->
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
        <a-button type="primary" @click="to_vuex"> 暂存到本地 </a-button>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
// import fileUploader from "@/utils/S3FileUploader";
// import { mapState } from "vuex";
const sources = [
  {
    courseId: "1",
    courseName: "线性代数习题.doc",
    tags: ["1章", "知识点", "练习题", "线代", "习题"],
    selected: false,
    src: require("../../../../../src/assets/img/SVGS/word.svg"),
  },
  {
    courseId: "2",
    courseName: "计算机构成说明书.jpg",
    tags: ["2章", "知识点2", "练习题2", "线代2", "习题2"],
    selected: false,
    src: require("../../../../../src/assets/img/SVGS/jpg.svg"),
  },
  {
    courseId: "3",
    courseName: "高等数学.xls",
    tags: ["3章", "知识点3", "练习题3", "线代3", "习题3"],
    selected: false,
    src: require("../../../../../src/assets/img/SVGS/excel.svg"),
  },
  {
    courseId: "4",
    courseName: "概率论与数理统计.ppt",
    tags: ["4章", "知识点4", "练习题4", "线代4", "习题4"],
    selected: false,
    src: require("../../../../../src/assets/img/SVGS/ppt.svg"),
  },
  {
    courseId: "5",
    courseName: "软件工程.pdf",
    tags: ["5章", "知识点5", "练习题5", "线代5", "习题5"],
    selected: false,
    src: require("../../../../../src/assets/img/SVGS/pdf.svg"),
  },
];
export default {
  data() {
    return {
      sources,
      // visible: false,
      selectvisible: false,
      // fileList: [],
      // labelCol: { span: 3 },
      // wrapperCol: { span: 14 },
      // fileForm: { name: "", tags: "" },
      // confirmLoading: false,
      // formRules: {
      //   name: [{ required: true, message: "资源名称不能为空" }],
      // },
    };
  },
  computed: {
    selectedsource() {
      return this.sources.filter((item) => item.selected);
    },
    // ...mapState({
    //   uid: (state) => state.public.uid,
    //   oid: (state) => state.public.oid,
    // }),
  },
  methods: {
    to_vuex() {},
    selectsource() {
      this.selectvisible = false;
    },
    onChange(course) {
      course.selected = !course.selected;
    },
    deleteit(item) {
      item.selected = !item.selected;
    },
    // fileInput(file) {
    //   this.fileList = [file];
    //   return false;
    // },
    // uploadFile() {
    //   this.confirmLoading = true;
    //   const that = this;
    //   const config = {
    //     that,
    //     apiUrl: "/pc/v1/resources/upload",
    //     filePath: `${this.oid}/teacher/`,
    //     body: that.createResource(),
    //     successCallback() {
    //       that.$message.success("上传成功！");
    //       that.confirmLoading = false;
    //     },
    //     failCallback(err) {
    //       console.error(err);
    //       that.confirmLoading = false;
    //       that.$message.error("上传失败！");
    //     },
    //     progressCallback(...args) {
    //       console.log({ args });
    //     },
    //   };
    //   const params = { Metadata: { star: "10" } };
    //   fileUploader(this.fileList, config, params);
    // },
    // createResource() {
    //   return {
    //     ...this.fileForm,
    //     authorId: this.uid,
    //     url: this.resourceUrl,
    //     tags: this.fileForm.tags.split("-"),
    //   };
    // },
  },
  // mounted() {
  // this.$store
  //   .dispatch("teacher/getSources", {
  //     lesson_id: this.lesson_id,
  //     teacher_id: this.uid,
  //   })
  //   .then(() => {
  //     this.sources = this.$store.getters["teacher/sources"];
  //     console.log(this.$store.getters["teacher/sources"]);
  //   });
  // },
};
</script>
<style>
.ant-card-body {
  padding: 20px;
}
</style>
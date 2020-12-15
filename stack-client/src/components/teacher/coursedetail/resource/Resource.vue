<template>
  <a-row>
    <a-row>
      <a-col :span="5">
        <a-input-search
          placeholder="名称、知识点"
          enter-button
          @search="onSearch"
        />
      </a-col>
      <a-col :span="12"></a-col>
      <a-col :span="6">
        <a-button type="primary" @click="localVisible = true"
          >本地上传</a-button
        >
        &nbsp;&nbsp;
        <a-button type="primary" @click="libiaryVisible = true"
          >资源库导入</a-button
        >
        &nbsp;&nbsp;
        <a-button type="primary">删除</a-button>
      </a-col>
    </a-row>
    <a-row class="cards-area" :gutter="30">
      <a-col :span="6" v-for="(course, index) in courses" :key="index">
        <a-card style="margin-top: 15px" size="small">
          <a slot="extra">
            <a-checkbox @change="onChange"></a-checkbox>
          </a>
          <img 
            slot="cover"
            alt="example"
            :src="course.src"
            width="100px"
            height="80px"
          />
          <h3>{{ course.courseName }}</h3><br/>
          <div>
            <template v-for="(tag, index) in course.tags">
              <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                <a-tag :key="tag" :closable="index !== 0" @close="() => handleClose(tag)">
                  {{ '${tag.slice(0, 100)}...' }}
                </a-tag>
              </a-tooltip>
              <a-tag v-else :key="tag" :closable="index !== 0" @close="() => handleClose(tag)">
                {{ tag }}
              </a-tag>
            </template>
            <a-input :key="index"
              v-if="inputVisible"
              ref="input"
              type="text"
              size="small"
              :style="{ width: '78px' }"
              :value="inputValue"
              @change="handleInputChange"
              @blur="handleInputConfirm"
              @keyup.enter="handleInputConfirm"
            />
            <a-tag :key="index" v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
              <a-icon type="plus" /> 新标签
            </a-tag>
          </div>
          <template slot="actions" class="ant-card-actions">
            <a-button type="primary">编辑</a-button>
            <a-button type="primary">下载</a-button>
          </template>
       </a-card>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center">
      <a-pagination
        class="pagination"
        :total="50"
        :show-size-changer="true"
        :show-quick-jumper="true"
      ></a-pagination>
    </a-row>
  
    <libiary :visible.sync="libiaryVisible"></libiary>
    <local :visible.sync="localVisible"></local>
  </a-row>
</template>

<script>
import Libiary from "./Libiary";
import Local from "./Local";

export default {
  components: { Libiary, Local },
  data() {
    return {
      inputVisible: false,
      inputValue: '',
      courses: [
        {
          courseId: "1",
          courseName: "线性代数习题.doc",
          tags:['jhksajnc', '知识点', '练习题','线代','习题'],
          src:require('../../../../../src/assets/img/SVGS/word.svg'),
        },
        {
          courseId: "2",
          courseName: "计算机构成说明书.jpg",
          tags:['2章', '知识点2', '练习题2','线代2','习题2'],
          src:require('../../../../../src/assets/img/SVGS/jpg.svg'),
        },
        {
          courseId: "3",
          courseName: "高等数学.xls",
          tags:['3章', '知识点3', '练习题3','线代3','习题3'],
          src:require('../../../../../src/assets/img/SVGS/excel.svg'),
        },
        {
          courseId: "4",
          courseName: "概率论与数理统计.ppt",
          tags:['4章', '知识点4', '练习题4','线代4','习题4'],
          src:require('../../../../../src/assets/img/SVGS/ppt.svg'),
        },
        {
          courseId: "5",
          courseName: "软件工程.pdf",
          tags:['5章', '知识点5', '练习题5','线代5','习题5'],
          src:require('../../../../../src/assets/img/SVGS/pdf.svg'),
        },
      ],
      libiaryVisible: false,
      localVisible: false,
    };
  },
  methods: {
    onChange(e) {
      console.log(`checked = ${e.target.checked}`);
    },
    handleClose(removedTag) {
      const tags = this.tags.filter(tag => tag !== removedTag);
      console.log(tags);
      this.tags = tags;
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(function() {
        this.$refs.input.focus();
      });
    },

    handleInputChange(e) {
         console.log("handleInputChange:",e)
      this.inputValue = e.target.value;
    },

    handleInputConfirm(e) {
      console.log("handleInputConfirme:",e)
      const inputValue = this.inputValue;
      let tags = this.tags;
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }
      console.log(tags);
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: '',
      });
    },
    onSearch() {},
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
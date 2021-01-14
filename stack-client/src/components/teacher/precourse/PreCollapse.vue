<template>
  <a-collapse default-active-key="1" :bordered="false">
    <a-collapse-panel :header="coursename" key="1">
      <a-row type="flex" justify="center">
        <a-button block type="primary" @click="addcourse(prepareNumber)">
          添加课时
        </a-button>
      </a-row>
      <a-list :data-source="coursehours">
        <a-list-item slot="renderItem" slot-scope="item, index" :id="index">
          <a-input
            v-if="coursehours[index].editable"
            style="margin: -5px 0"
            :value="item.name"
            ref="courseinput"
            @keyup.enter="(e) => handleChange(index, e.target.value)"
            @blur="(e) => handleChange(index, e.target.value)"
          />
          <span v-else class="coursename" @click="courseclick(index)">{{
            item.name
          }}</span>
          <template #extra v-if="!coursehours[index].editable">
            <a-button-group>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>编辑名称</span>
                </template>
                <a-button
                  icon="edit"
                  size="small"
                  type="link"
                  @click="editcourse(index)"
                ></a-button>
              </a-tooltip>
              <!-- <a-tooltip placement="top">
                <template slot="title">
                  <span>增加课时</span>
                </template>
                <a-button
                  icon="plus"
                  size="small"
                  type="link"
                  @click="addcourse(index)"
                ></a-button>
              </a-tooltip> -->
              <a-tooltip placement="top">
                <template slot="title">
                  <span>删除课时</span>
                </template>
                <a-button
                  icon="minus"
                  size="small"
                  type="link"
                  @click="deletecourse(index)"
                ></a-button>
              </a-tooltip>
            </a-button-group>
          </template>
        </a-list-item>
      </a-list>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
import axios from "@/utils/axios";
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      prepareNumber: this.$route.query.prepareNumber,
      coursehours: [],
    };
  },
  methods: {
    courseclick(index) {
      this.$store.commit("teacher/updateCurCourseHour", index);
    },
    editcourse(index) {
      this.coursehours[index].editable = true;
      this.$nextTick(() => {
        this.$refs.courseinput.focus();
      });
    },
    addcourse(index) {
      this.coursehours.splice(index + 1, 0, {
        name: "新增课时",
        editable: true,
        isNew: true,
      });
      this.$nextTick(() => {
        this.$refs.courseinput.focus();
      });
      this.prepareNumber += 1;
    },
    deletecourse(index) {
      axios
        .post("pc/v1/prepares/deleteSection", {
          lesson_id: this.lesson_id,
          teacher_id: this.uid,
          section_index: index + 1,
        })
        .then(({ data }) => {
          if (!data.status) throw "delete coursehour fail";
          this.coursehours.splice(index, 1);
          if (this.$store.state.teacher.courseHours.length) {
            this.$store.commit("teacher/updateCurCourseHour", index - 1);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    handleChange(index, value) {
      const cb = (item, idx) => item.name === value && index !== idx;
      if (this.coursehours.some(cb)) {
        this.$message.info("课时名称重复");
        return null;
      }
      let url = "";
      let tips = "";
      let errtips = "";

      if (this.coursehours[index].isNew) {
        url = "pc/v1/prepares/addNewSection";
        tips = "新增课时失败";
        errtips = "new courseHour fail";
      } else {
        url = "pc/v1/prepares/updateSectionName";
        tips = "编辑课时失败";
        errtips = "update coursehour fail";
      }
      axios
        .post(url, {
          lesson_id: this.lesson_id,
          teacher_id: this.uid,
          section_index: index + 1,
          section_name: value,
        })
        .then(({ data }) => {
          if (!data.status) throw errtips;
          let coursehour = this.coursehours[index];
          coursehour.name = value;
          coursehour.editable = false;
          delete coursehour.isNew;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(tips);
        });
    },
  },
  computed: {
    ispublished() {
      return true;
    },
    ...mapState({
      uid: (state) => state.public.uid,
    }),
    lesson_id() {
      return this.$route.query.lessonId;
    },
    coursename() {
      return this.$route.query.lessonName;
    },
  },
  mounted() {
    this.$store
      .dispatch("teacher/getCourseHours", {
        lesson_id: this.lesson_id,
        teacher_id: this.uid,
      })
      .then(() => {
        this.coursehours = this.$store.getters["teacher/courseHours"].map(
          (item) => ({
            editable: false,
            name: item,
          })
        );
        if (!this.$store.state.teacher.courseHours.length) {
          this.addcourse(0);
          this.$store.commit("teacher/updateCurCourseHour", 0);
        }
      });
  },
};
</script>

<style scoped>
.coursename {
  cursor: pointer;
}

.btn-area {
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
}

.ant-btn[disabled] {
  color: #ffffff;
  background-color: #001529;
  border-color: #001529;
}
.ant-btn {
  color: #ffffff;
}
.ant-list {
  color: #ffffff;
}
</style>

<style>
.ant-collapse > .ant-collapse-item > .ant-collapse-header {
  color: #ffffff;
}
.ant-collapse {
  background-color: #001529;
}
.ant-collapse-content {
  background-color: #001529;
}
</style>
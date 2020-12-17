<template>
  <div>
    <a-row class="btn-area">
      <a-col :span="5">
        <a-input-search
          placeholder="学校名称"
          enter-button
          v-model="condition"
          @search="searchSchool"
        />
      </a-col>
      <a-col :span="17"></a-col>
      <a-col :span="2" class="btn">
        <a-button @click="toggleAddSchool" type="primary">添加学校</a-button>
      </a-col>
    </a-row>

    <a-row class="collapse">
      <a-col>
        <a-collapse v-model="activeKey" height="40px">
          <a-collapse-panel
            v-for="school in schools"
            :key="school.sid"
            :header="school.schoolName"
            style="margin: 10px 0"
          >
            <p>{{ school.desc }}</p>
            <a-icon
              slot="extra"
              type="setting"
              @click="(e) => setSchool(e, school)"
            />
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row>

    <a-modal
      v-model="addUniversityVisible"
      :title="isEdit ? '编辑学校' : '添加学校'"
      @ok="addUniversity"
      :maskClosable="false"
    >
      <a-form-model
        :model="addUniversityForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="formRules"
        ref="addSchool"
      >
        <a-form-model-item label="学校名称" prop="universityName">
          <a-input
            placeholder="请输入学校名称"
            v-model="addUniversityForm.universityName"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="英文名称" prop="universityEnName">
          <a-input
            placeholder="请输入学校英文名称"
            v-model="addUniversityForm.universityEnName"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="学校简介" prop="universityDesc">
          <a-textarea
            placeholder="请输入学校简介"
            :auto-size="{ minRows: 3 }"
            v-model="addUniversityForm.universityDesc"
          >
          </a-textarea>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import axios from "@/utils/axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      activeKey: [],
      condition: "",
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
      addUniversityVisible: false,
      isEdit: false,
      addUniversityForm: {
        sid: "",
        universityName: "",
        universityEnName: "",
        universityDesc: "",
      },
      formRules: {
        universityName: [{ required: true, message: "学校名称不能为空" }],
        universityEnName: [{ required: true, message: "学校英文名称不能为空" }],
      },
      schools: [],
    };
  },
  computed: {
    ...mapState({
      schoolList: (state) => state.super.schoolList,
    }),
  },
  methods: {
    addUniversity() {
      this.$refs.addSchool.validate(valid => {
        if (!valid) return false;
        this.isEdit ? this.submitEditSchool() : this.submitAddSchool();
      });
    },
    async submitAddSchool() {
      try {
        const { data } = await axios.post("/pc/v1/organizations", {
          organizationName: this.addUniversityForm.universityName,
          organizationNameEn: this.addUniversityForm.universityEnName.replace(/\s+/g, "_"),
          organizationDescription: this.addUniversityForm.universityDesc,
        });
        if (data.status === "success") {
          this.addUniversityVisible = false;
          this.$message.success("添加学校成功");
          this.$store.dispatch("super/getSchoolList")
            .then(() => { this.searchSchool() });
        }
      } catch (error) {
        console.log(error);
        this.$message.error("添加学校失败！");
      }
    },
    async submitEditSchool() {
      const url = `/pc/v1/organizations/${this.addUniversityForm.sid}`;
      try {
        const { data } = await axios.patch(url, {
          organizationName: this.addUniversityForm.universityName,
          organizationNameEn: this.addUniversityForm.universityEnName.replace(/\s+/g, "_"),
          organizationDescription: this.addUniversityForm.universityDesc,
        });
        if (data.status === "success") {
          this.addUniversityVisible = false;
          this.$message.success("修改学校信息成功");
          this.$store.dispatch("super/getSchoolList")
            .then(() => { this.searchSchool() });
        }
      } catch (error) {
        console.log(error);
        this.$message.error("修改学校信息失败！");
      }
    },
    async setSchool(e, { desc, schoolName, schoolEnName, sid }) {
      e.stopPropagation();
      this.isEdit = true;
      this.addUniversityForm = {
        sid: sid,
        universityName: schoolName,
        universityEnName: schoolEnName,
        universityDesc: desc,
      }
      this.addUniversityVisible = true;
    },
    searchSchool() {
      if (!this.condition) this.schools = this.schoolList;
      else {
        const cb = (item) => item.schoolName.includes(this.condition);
        this.schools = this.schoolList.filter(cb);
      }
    },
    toggleAddSchool() {
      this.addUniversityForm = {
        universityName: "",
        universityEnName: "",
        universityDesc: ""
      }
      this.isEdit = false;
      this.addUniversityVisible = true;
    }
  },
  mounted: function () {
    if (!this.schoolList.length) {
      this.$store.dispatch("super/getSchoolList")
        .then(() => { this.searchSchool() });
    } else {
      this.searchSchool();
    }
  },
};
</script>

<style scoped>
.btn-area {
  background: #fff;
  padding: 15px 10px;
  border-radius: 5px;
}
.collapse {
  padding: 15px 0;
}
</style>
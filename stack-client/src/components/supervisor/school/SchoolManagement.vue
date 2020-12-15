<template>
  <div>
    <a-row class="btn-area">
      <a-col :span="5">
        <a-input-search
          placeholder="学校编号/名称"
          enter-button
          @search="onSearch"
        />
      </a-col>
      <a-col :span="17"></a-col>
      <a-col :span="2" class="btn">
        <a-button @click="addUniversityVisible = true" type="primary"
          >添加学校</a-button
        >
        <a-modal
          v-model="addUniversityVisible"
          :title="editVisible ? '编辑学校' : '添加学校'"
          @ok="addUniversity"
          :maskClosable="false"
        >
          <a-form-model
            :model="addUniversityForm"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :rules="formRules"
          >
            <a-form-model-item label="学校名称" prop="universityName">
              <a-input
                placeholder="请输入学校名称"
                v-model="addUniversityForm.universityName"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item label="学校简介" prop="universityDesc">
              <a-textarea
                placeholder="请输入学校简介"
                :auto-size="{ minRows: 3 }"
                v-model="addUniversityForm.universityDesc"
              ></a-textarea>
            </a-form-model-item>
          </a-form-model>
        </a-modal>
      </a-col>
    </a-row>
    <a-row class="collapse">
      <a-col>
        <a-collapse v-model="activeKey" height="20px">
          <a-collapse-panel key="1" header="陕西师范大学">
            <p>{{ text1 }}</p>
            <a-icon slot="extra" type="setting" @click="handleClick" />
          </a-collapse-panel>
          <a-collapse-panel key="2" header="西安邮电大学" :disabled="false">
            <p>{{ text2 }}</p>
            <a-icon slot="extra" type="setting" @click="handleClick" />
          </a-collapse-panel>
          <a-collapse-panel key="3" header="长安大学" :disabled="false">
            <p>{{ text3 }}</p>
            <a-icon slot="extra" type="setting" @click="handleClick" />
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text1: `陕西师范大学（Shaanxi Normal University）简称陕西师大、陕师大，坐落于陕西省会西安，是中华人民共和国教育部直属重点综合性师范大学，国家“211工程”重点建设大学，国家首批世界一流学科建设高校，入选国家“111计划”、“2011计划”、卓越教师培养计划、国家建设高水平大学公派研究生项目、国家大学生文化素质教育基地、中国政府奖学金来华留学生接收院校、全国深化创新创业教育改革示范高校，全国首批博士、硕士学位授予单位，中俄教育类高校联盟、新丝绸之路大学联盟、长安联盟创始成员，国家教育体制改革首批试点高校，国家师范生公费教育试点院校，是国家培养高等院校、中等学校师资和教育管理干部以及其他高级专门人才的重要基地。`,
      text2: `西安邮电大学（Xi’an University of Posts & Telecommunications）简称西邮、西安邮电，是中华人民共和国工业和信息化部与陕西省政府共建高校、陕西省省属高水平大学、教育部“卓越工程师教育培养计划”实施高校、国家级大学生创新创业训练计划立项高校、教育部”新工科研究与实践项目“入选高校、长安联盟、CDIO工程教育联盟成员单位，中国人民解放军后备军官选拔培养基地、全国首批试办边防军人子女预科班的高校、西北地区唯一承担亚太电信组织和东盟培训任务的高校，已发展成一所以工学为主，以信息科学技术为特色，工、理、管、经、文、法、艺多学科协调发展的教学研究型大学。`,
      text3:
        "长安大学（Chang’an University）座落于陕西省会西安，直属中华人民共和国教育部，是教育部和交通运输部、自然资源部、住房和城乡建设部、陕西省人民政府共建的国家“世界一流学科建设高校”，国家“211工程”重点建设大学，国家“985工程优势学科创新平台”建设高校；入选国家“111计划”、“双万计划”、教育部“卓越工程师教育培养计划”、国家建设高水平大学公派研究生项目、国家级大学生创新创业训练计划、国家级新工科研究与实践项目；是高水平行业特色大学优质资源共享联盟、中俄交通大学联盟成员高校，是中国政府奖学金来华留学生接收院校、国家大学生文化素质教育基地、首批高等学校科技成果转化和技术转移基地。",
      activeKey: ["1"],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      addUniversityVisible: false,
      addUniversityForm: {
        universityName: "",
        universityDesc: "",
      },
      editVisible: false,
      formRules: {
        universityName: [
          { required: true, min: 2, message: "学校名称最少2个字" },
        ],
        universityDesc: [{ required: true, message: "学校简介不能为空" }],
      },
    };
  },
  watch: {
    activeKey(key) {
      console.log(key);
    },
  },
  methods: {
    handleClick(event) {
      // If you don't want click extra trigger collapse, you can prevent this:
      event.stopPropagation();
    },
    addUniversity() {},
    onSearch() {},
  },
};
</script>

<style>
.btn-area {
  padding-bottom: 30px;
}
</style>



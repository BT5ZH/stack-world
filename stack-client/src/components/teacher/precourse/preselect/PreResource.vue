<template>
  <div>
    <a-card title="资源上传" class="setcard"> </a-card>
    <br />
    <a-row>
      <a-col :span="3">
        <a-menu style="width: 150px" v-model="curMenus">
          <!-- <a-menu-item key="Knowledge">课程知识点</a-menu-item> -->
          <a-menu-item key="Resource">课程资源</a-menu-item>
          <a-menu-item key="Question">课程试题</a-menu-item>
          <!-- <a-menu-item key="Class">课程班级</a-menu-item> -->
        </a-menu>
      </a-col>
      <a-col :span="21">
        <component :is="curMenus[0]"></component>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Resource from "../../coursedetail/resource/Resource";
import Question from "../../coursedetail/question/Question";

export default {
  components: { Resource, Question },
  data() {
    return {
      curMenus: ["Resource"],
    };
  },
  methods: {},
};
</script>

<style scoped>
</style>
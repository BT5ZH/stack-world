<template>
  <div>
    <a-row>
      <a-col :span="3">
        <leftMenu></leftMenu>
      </a-col>
      <a-col :span="2"></a-col>
      <a-col :span="16">
        <!-- 下拉菜单 -->
        <a-dropdown>
          <a-button block> {{ menuSelectData }} <a-icon type="down" /> </a-button>
          <a-menu slot="overlay">
            <a-menu-item
              style="width=800px;"
              v-for="SubOrg in treeData"
              :key="SubOrg.subOrgName"
              @click="menuSelect({ subOrg: SubOrg.subOrgName })"
              >{{ SubOrg.subOrgName }}
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <br /><br />
        <component
          :patrolMessage="patrolMessage"
          @goInfo="goInfo"
          :is="componentID"
        ></component>
        <!-- <patrolSchedule @goInfo="goInfo"></patrolSchedule> -->
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { mapState } from "vuex";

import leftMenu from "./patrolLeftMenu";
import patrolTable from "./patrolMessage/patrolMessageTable";
import patrolSchedule from "./patrolMessage/schedule";

export default {
  components: { leftMenu, patrolTable, patrolSchedule },
  data() {
    return {
      componentID: "patrolSchedule",
      patrolMessage: [],
    };
  },
  computed: {
    ...mapState({
      orgName: (state) => state.public.orgName,
      treeData: (state) => state.patrol.patrolTree,
      menuSelectData: (state) => state.patrol.menuSelect.subOrg,
      oid: (state) => state.public.oid,
    }),
  },
  mounted() {
    // 获取查询树
    this.$store.dispatch("patrol/getPatrolTree", this.oid);
    // 获取所有巡课信息
    this.$store.dispatch("patrol/getPatrolMessage", this.orgName);
  },
  methods: {
    menuSelect(params) {
      this.$store.commit("patrol/updateMenuSelect", params);
    },
    goInfo(element, componentID) {
      // 跳转页面
      this.componentID = componentID;
      this.patrolMessage = element;
    },
  },
};
</script>
<style></style>

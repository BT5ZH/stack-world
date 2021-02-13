<template>
  <a-row class="container">
    <a-row :span="20" style="margin: 10px 25px 20px 5px">
      <a-spin :spinning="Tree_spin_status">
        <a-tree-select
          style="width: 100%"
          :value="value"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :placeholder="orgName"
          allow-clear
          tree-default-expand-all
          @change="onChange"
          @search="onSearch"
          @select="onSelect"
        >
          <a-tree-select-node
            :selectable="false"
            :key="item.subOrgName"
            :value="item.subOrgName"
            :title="item.subOrgName"
            v-for="item in treeData"
          >
            <a-tree-select-node
              :key="mName.majorName"
              :value="`${mName.majorName}:${item.subOrgName}`"
              :title="mName.majorName"
              v-for="mName in item.majors"
            >
            </a-tree-select-node>
          </a-tree-select-node>
        </a-tree-select>
      </a-spin>
    </a-row>
    <a-col :span="2"></a-col>
    <a-col :span="19">
      <connect-list
        class="connect-list"
        :orginfo="value"
        :orgname="orgName"
      ></connect-list>
    </a-col>
  </a-row>
</template>

<script>
import ConnectList from "./connectList";
// import axiosInstance from "@/utils/axios";
import { mapState } from "vuex";

export default {
  components: { ConnectList },
  data() {
    return {
      value: undefined,
      treeData: [],
    };
  },
  computed: {
    ...mapState({
      Tree_spin_status: (state) => state.admin.Tree_spin_status,
      uid: (state) => state.public.uid,
      oid: (state) => state.public.oid,
      orgName: (state) => state.public.orgName,
    }),
  },
  mounted() {
    this.getTreeData();
    // this.getCourses();
  },
  methods: {
    // async
    getTreeData() {
      let queryString = this.oid;
      const url = "/pc/v1/organizations/" + queryString + "/tree";
      // console.log(url);
      this.$store
        .dispatch("admin/getTreeByURLwithSpin", url)
        .then((response) => {
          console.log("---------connect---------");
          console.log(response);
          this.treeData = response.data.tree;
        })
        .catch((error) => {
          console.log(error);
        });
      // try {
      //   this.$store.dispatch("admin/change_spin_status", true);
      //   const { data } = await axiosInstance.get(url);
      //   this.$store.dispatch("admin/change_spin_status", false);
      //   console.log(data.data);
      //   console.log("----treedata-----")
      //   console.log(data.tree)
      //   this.treeData = data.tree;
      // } catch (err) {
      //   console.log(err);
      // }
    },
    onChange(data) {
      // console.log("onchange:   " + data);
      this.value = data;
    },
    onSearch() {
      // console.log(...arguments);
    },
    onSelect() {
      // console.log("selected:   ");
      // console.log(...arguments);
    },
  },
};
</script>

<style scoped>
.class-table {
  padding-left: 20px;
}

.container {
  padding: 10px;
  height: 100%;
}
</style>

<template>
  <a-row class="container">
    <a-row :span="20" style="margin: 10px 25px 20px 5px">
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
          :key="item._id"
          :value="item._id"
          :title="item._id"
          v-for="item in treeData"
        >
          <a-tree-select-node
            :key="mName"
            :value="`${mName}:${item._id}`"
            :title="mName"
            v-for="mName in item.majors"
          >
          </a-tree-select-node>
        </a-tree-select-node>
      </a-tree-select>
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
import axiosInstance from "@/utils/axios";
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
      uid: (state) => state.public.uid,
      oid: (state) => state.public.oid,
      orgName: (state) => state.public.org_name,
    }),
  },
  mounted() {
    this.getTreeData();
    // this.getCourses();
  },
  methods: {
    async getTreeData() {
      let queryString = this.orgName;
      const url = "/pc/v1/courses/courseTree?org_name=" + queryString;
      // console.log(url);
      try {
        const { data } = await axiosInstance.get(url);
        // console.log(data.data);
        this.treeData = data.data;
      } catch (err) {
        console.log(err);
      }
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

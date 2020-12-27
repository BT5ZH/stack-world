<template>
  <a-row class="container">
    <a-row :span="20" style="margin: 10px 25px 20px 5px;">
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
          :key="campus.campus_name"
          :value="campus.campus_name"
          :title="campus.campus_name"
          v-for="campus in campusList"
        >
          <a-tree-select-node
            :key="buildings.name"
            :value="`${buildings._id}:${buildings.name}`"
            :title="buildings.name"
            v-for="buildings in campus.buildings"
          >
            <!-- <a-tree-select-node key="random" value="leaf1" title="my leaf" />
            <a-tree-select-node key="random1" value="leaf2" title="your leaf" /> -->
          </a-tree-select-node>
        </a-tree-select-node>
      </a-tree-select>
    </a-row>

    <a-row :span="20">
      <space-card
        class="class-card"
        :rooms="roomList"
        :buildingName="currentBuilding"
      ></space-card>
    </a-row>
  </a-row>
</template>

<script>
import SpaceCard from "./SpaceCard";
import axiosInstance from "@/utils/axios";
import { mapState } from "vuex";
export default {
  components: { SpaceCard },
  data() {
    return {
      value: undefined,
      campusList: [],
      roomList: [],
      currentBuilding: "",
      // leaf: false,
    };
  },
  computed: {
    ...mapState({
      uid: (state) => state.public.uid,
      oid: (state) => state.public.oid,
      orgName: (state) => state.public.org_name,
    }),
  },
  methods: {
    async onChange(data) {
      console.log("onchange:   " + data);
      const value = data.split(":")[0];
      console.log("onchange:   " + value);
      this.currentBuilding = data.split(":")[1];
      console.log("onchange:   " + this.currentBuilding);
      const queryObject = {
        building: value,
      };
      let queryString = "";
      Object.keys(queryObject).forEach((key) => {
        queryString += key + "=" + queryObject[key] + "&";
      });
      queryString = "?" + queryString.slice(0, -1);
      const url = "/pc/v1/rooms" + queryString;

      try {
        const { data } = await axiosInstance.get(url);
        console.log(data);
        this.roomList = data.rooms;
        console.log(this.roomList);
      } catch (err) {
        console.log(err);
      }

      this.value = this.currentBuilding;
    },
    onSearch() {
      console.log(...arguments);
    },
    onSelect() {
      console.log("selected:   ");
      console.log(...arguments);
    },
    async spaceList() {
      let queryString = "";
      const url = "/pc/v1/campus" + queryString;
      try {
        const { data } = await axiosInstance.get(url);
        this.campusList = data.data.campus;
        console.log(this.campusList);
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.spaceList();
  },
};
</script>

<style scoped>
.class-card {
  padding-left: 20px;
}

.container {
  padding: 10px;
  height: 100%;
}
</style>

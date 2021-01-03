<template>
  <div>
    <a-row>
      <a-col>
        <a-select
          default-value="place"
          style="width: 120px"
          @change="handleChange"
        >
          <a-select-option value="place">
            按地点查询
          </a-select-option>
          <a-select-option value="teacher">
            按教师查询
          </a-select-option>
          <a-select-option value="student">
            按学生查询
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row>
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
          :value="`${campus._id}#`"
          :title="campus.campus_name"
          v-for="campus in campusList"
        >
          <a-tree-select-node
            :key="buildings.building_name"
            :value="`${campus._id}:${buildings._id}`"
            :title="buildings.building_name"
            v-for="buildings in campus.buildings"
          >
          </a-tree-select-node>
        </a-tree-select-node>
      </a-tree-select>
    </a-row>
    <a-card title="Card Title">
      <a-card-grid style="width:25%;text-align:center">
        Content
      </a-card-grid>
      <a-card-grid style="width:25%;text-align:center" :hoverable="false">
        Content
      </a-card-grid>
      <a-card-grid style="width:25%;text-align:center">
        Content
      </a-card-grid>
      <a-card-grid style="width:25%;text-align:center">
        Content
      </a-card-grid>
      <a-card-grid style="width:25%;text-align:center">
        Content
      </a-card-grid>
      <a-card-grid style="width:25%;text-align:center">
        Content
      </a-card-grid>
      <a-card-grid style="width:25%;text-align:center">
        Content
      </a-card-grid>
      <a-card-grid style="width:25%;text-align:center">
        Content
      </a-card-grid>
    </a-card>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axios";
import { mapState } from "vuex";
export default {
  data() {
    return {
      value: "",
      campusList: [],
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
    this.getSpaceList();
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    async getSpaceList() {
      let queryString = "";
      const url = "/pc/v1/campus" + queryString;
      try {
        const { data } = await axiosInstance.get(url);
        this.campusList = data.data.campus;
      } catch (err) {
        console.log(err);
      }
    },
    async onChange(value, label) {
      this.flag = value;
      if (this.flag.slice(-1) == "#") {
        let payload = {};
        let temp = this.flag.slice(0, -1);
        payload = { campus_id: temp };
        this.getSpaceFromCondition(payload, 1);
      } else {
        let payload = {};
        let dataArray = this.flag.split(":");
        payload = {
          campus_id: dataArray[0],
          building_id: dataArray[1],
        };
        this.getSpaceFromCondition(payload, 2);
      }
      this.value = label;
    },
    onSearch() {
      console.log(...arguments);
    },
    onSelect() {
      console.log(...arguments);
    },
    async getSpaceFromCondition(payload, type) {
      let queryString = "";
      Object.keys(payload).forEach((key) => {
        queryString += key + "=" + payload[key] + "&";
      });

      queryString = "?" + queryString.slice(0, -1);
      const url = "/pc/v1/rooms/getRoomByCampusOrBuilding" + queryString;
      try {
        const { data } = await axiosInstance.get(url);
        if (type == 1) {
          this.buildingList = data.data.buildings;
          console.log(this.buildingList);
        } else if (type == 2) {
          console.log(data.data);
          this.roomList = data.data.rooms;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style></style>

<template>
  <div>
    <a-empty v-if="!buildingProp.length"></a-empty>
    <a-row :gutter="8" v-else>
      <a-col
        v-for="(building, index) in buildingProp"
        :key="index"
        :span="6"
        class="card-container"
      >
        <a-card
          class="space"
          :style="{
            backgroundColor: `${buildingMap[building.building_type]['color']}`,
          }"
        >
          <a-icon
            :type="buildingMap[building.building_type]['icon']"
            class="room_icon"
          />
          <div
            style="display: flex;justify-content: space-between;align-items: flex-start;"
          >
            <a-checkbox
              @change="onChange($event, building.building_name)"
            ></a-checkbox>
            <p>{{ building.building_name }}</p>
            <a-tag color="#2db7f5">文津楼</a-tag>
            <a-tag color="#ffb900">{{
              buildingMap[building.building_type]["name"]
            }}</a-tag>
            <a-icon type="right-circle" style="font-size: 20px;" />
          </div>
          <div>
            <p>负责人：{{ building.building_name }}</p>
            <p>安全员：{{ building.building_name }}</p>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  props: ["buildingProp"],
  data() {
    return {
      buildingMap: {
        classroom: { name: "教室", color: "#96BFFF", icon: "home" },
        lab: { name: "实验室", color: "#FFDB5C", icon: "experiment" },
        office: { name: "办公室", color: "#9FE6B8", icon: "bank" },
        others: { name: "其他", color: "#ff9f7f", icon: "question" },
      },

      checkedList: [],
      buildings: [],
    };
  },
  watch: {
    buildings: {
      immediate: true,
      handler(value) {
        this.buildings = value;
      },
    },
  },
  methods: {
    onChange(e, value) {
      if (e.target.checked) {
        this.checkedList.push(value);
      } else {
        let index = this.checkedList.findIndex((item) => {
          return item === value;
        });
        //删除元素
        this.checkedList.splice(index, 1);
      }
      console.log(this.checkedList);
    },
  },
  mounted() {
    this.buildings = this.buildingProp;
  },
};
</script>

<style scoped>
.my-statistic-title {
  margin-bottom: 10px;
  color: #fff;
  font-size: 20px;
  letter-spacing: 3px;
}

.btn-area {
  padding: 20px 0 20px;
  display: flex;
  justify-content: space-between;
}

.card-container {
  padding-top: 20px;
}

.Card_Info {
  padding-top: 20px;
}

.space {
  border-radius: 6px;
  color: #fff;
  font-weight: 500;
  overflow: hidden;
  font-size: 15px;
}

.room_icon {
  min-height: 100%;
  font-size: 80px;
  position: absolute;
  top: 35%;
  right: -5%;
  color: #fff;
  opacity: 0.4;
}
</style>

<template>
  <div>
    <a-empty v-if="!tempList.length"></a-empty>
    <a-row :gutter="8" v-else>
      <a-col
        v-for="(room, index) in tempList"
        :key="index"
        :span="4"
        class="card-container"
      >
        <a-card class="space">
          <a-checkbox @change="onChange($event, room.room_number)">{{
            room.room_number
          }}</a-checkbox>
          <a-tag color="#2db7f5">{{ buildingName }}</a-tag>
          <a href=""></a>
        </a-card>
      </a-col>
      <!-- <a-checkbox-group v-model="checkedList" :options="classList.name" @change="onChange" /> -->
    </a-row>

    <!-- <a-row v-if="tempList.length">
      <a-pagination :total="50" show-size-changer show-quick-jumper />
    </a-row> -->
  </div>
</template>

<script>
export default {
  props: { rooms: { type: Array }, buildingName: { type: String } },
  data() {
    return {
      searchContent: "",
      // classList: [
      //   { name: "文津3624" },
      //   { name: "文津1116" },
      //   { name: "文津3624" },
      //   { name: "文津1116" },
      // ],
      // rooms: [],
      tempList: [],
      checkedList: [],
    };
  },
  watch: {
    rooms: {
      immediate: true,
      handler(value) {
        console.log(value);
        this.tempList = value;
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
};
</script>

<style scoped>
.btn-area {
  padding: 20px 0 20px;
  display: flex;
  justify-content: space-between;
}

.card-container {
  padding-bottom: 20px;
}

.space {
  width: 50px;
  height: 50px;
  border-radius: 3px;
}
</style>

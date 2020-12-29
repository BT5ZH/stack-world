<template>
  <div>
<!-- 统计卡片 -->
<a-row :gutter="40">
  <a-col :span="8" v-for="(item, index) in sumList" :key="index">
    <a-card :style="{borderRadius:'6px',overflow:'hidden'}" :bodyStyle='{ backgroundColor: `${item.color}`,borderRadius:"6px"}'>
      <a-icon :type="item.icon" class="room_icon" />
      <a-statistic :value="item.number" suffix="个" :value-style="{ color: '#fff' }">
        <template #title>
          <p class="my-statistic-title">{{item.title}}</p>
        </template>
        <template #prefix>
          <a-icon :type="item.icon" :style="{ color: '#fff',marginRight:'20px',fontSize:'30px'}" />
        </template>
      </a-statistic>
    </a-card>
  </a-col>
</a-row>
    <a-row :gutter="8">
      <a-col v-for="(room, index) in tempList" :key="index" :span="6" class="card-container">
        <a-card class="space" :style="{backgroundColor:`${roomMap[room.room_type]['color']}`}">
          <a-icon :type="roomMap[room.room_type]['icon']" class="room_icon" />
          <div style="display: flex;justify-content: space-between;align-items: flex-start;">
            <a-checkbox @change="onChange($event, room.room_number)"></a-checkbox>
            <p>{{room.room_number}}</p>
            <!-- <a-tag color="#2db7f5">{{ buildingName }}</a-tag> -->
            <a-tag color="#2db7f5">文津楼</a-tag>
            <a-tag color="#ffb900">{{roomMap[room.room_type]['name']}}</a-tag>
            <a-icon type="right-circle" style="font-size: 20px;"/>
          </div>
          <div>
            <p>负责人：{{room.principal}}</p>
            <p>安全员：{{room.safety_man}}</p>
          </div>
          <!-- <a href=""></a> -->
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
    // props: { rooms: { type: Array }, buildingName: { type: String } },
    props:['roomsProp','buildingProp','typeProp'],
    data() {
      return {
        searchContent: "",
        roomMap: {
          classroom: { name:"教室",color: "#96BFFF", icon: "home" },
          lab: { name:"实验室",color: "#FFDB5C", icon: "experiment" },
          office: { name:"办公室",color: "#9FE6B8", icon: "bank" },
          others: { name:"其他",color: "#ff9f7f", icon: "question" },
        },
        sumList: [
          { title: "建筑", number: '15', icon: 'bank', color: '#ffbf35' },
          { title: "房间", number: '4', icon: 'trophy', color: '#50b8ee' },
          { title: "房间类型", number: '357', icon: 'book', color: '#fb7293' },
        ],
        // rooms: [],
        tempList: [
          { room_number: '3624', room_type: 'lab', safety_man: '祁超', principal: '祁超',},
          { room_number: '3412', room_type: 'classroom', safety_man: '贾润泽', principal: '毛庆',},
          { room_number: '3418', room_type: 'office', safety_man: '毛庆', principal: '贾润泽',},
          { room_number: '3215', room_type: 'others', safety_man: '毛庆', principal: '毛庆',},
        ],
        checkedList: [],
      };
    },
    watch: {
      // rooms: {
      //   immediate: true,
      //   handler(value) {
      //     console.log(value);
      //     this.tempList = value;
      //   },
      // },
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
      staticInfo(){
        let builNumber = {
        title: "建筑",
        number: this.buildingProp,
        icon: "bank",
        color: "#ffbf35",
      };
      let roomsNumber = {
        title: "教室",
        number: this.roomsProp,
        icon: "trophy",
        color: "#50b8ee",
      };
      let typeNumber = {
        title: "类型",
        number: this.typeProp,
        icon: "book",
        color: "#fb7293",
      };
      let tempList = [];
      tempList.push(builNumber);
      tempList.push(roomsNumber);
      tempList.push(typeNumber);
      this.sumList = tempList;
      }
    },
    mounted(){
      this.staticInfo();
    }
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

  .space {
    border-radius: 6px;
    color: #fff;
    font-weight: 500;
    overflow: hidden;
    font-size: 15px;
  }

  .room_icon{
    min-height: 100%;
    font-size: 80px;
    position: absolute;
    top: 35%;
    right: -5%;
    color: #fff;
    opacity: 0.4;
  }
</style>
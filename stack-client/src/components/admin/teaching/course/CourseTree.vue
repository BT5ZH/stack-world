<template>
  <!-- <div id="courseDashboard" style="width: 600px;height:400px;"></div> -->
  <div>
    <a-row :gutter="40">
      <a-col :span="8" v-for="(item, index) in sumList" :key="index">
        <a-card @click:="ifClick(item.title)" :style="{ borderRadius: '6px', overflow: 'hidden' }"
          :bodyStyle="{ backgroundColor: `${item.color}`, borderRadius: '6px' }">
          <a-icon :type="item.icon" class="room_icon" />
          <a-statistic :value="item.number" suffix="个" :value-style="{ color: '#fff' }">
            <template #title>
              <p class="my-statistic-title">{{ item.title }}</p>
            </template>
            <template #prefix>
              <a-icon :type="item.icon" :style="{
                  color: '#fff',
                  marginRight: '20px',
                  fontSize: '30px',
                }" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
    <a-row class="Card_Info" style="padding-top:20px;">
      <a-col>
        <a-card title="学院">
          <a-card-grid v-for="(i,index) in collegeProp" :key="index" style="width:25%;text-align:center">
            {{i}}
          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row class="Card_Info2">
      <a-col>
        <a-card title="专业">
          <a-card-grid v-for="(i,index) in majorProp" :key="index" style="width:25%;text-align:center">
            {{i}}
          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>


    <a-divider style="border-color: rgb(183, 186, 187);" />
  </div>
</template>

<script>
  import axios from "@/utils/axios";

  export default {
    data() {
      return {
        ifClickMajor: false,
        ifClickCollege: false,
        collegeList: [],
        style: { icon: "trophy", color: "#50b8ee" },
        sumList: [],
      };
    },

    props: ["courseProp", "majorProp", "collegeProp", "pieProp"],
    methods: {
      ifClick(cardName) {
        if (cardName == "专业") {
          this.ifClickMajor = true;
          this.ifClickCollege = false;
          this.clickName = cardName;
          console.log(cardName)
        } else if (cardName == "学院") {
          this.ifClickCollege = true;
          this.ifClickMajor = false;
          this.clickName = cardName;
          console.log(this.clickName + this.ifClickRoomType);
        }
      },
      statisticInfo() {
        let colNumber = {
          title: "学院",
          number: this.collegeProp.length,
          icon: "bank",
          color: "#ffbf35",
        };
        let majNumber = {
          title: "专业",
          number: this.majorProp.length,
          icon: "bank",
          color: "#50b8ee",
        };
        let couNumber = {
          title: "课程",
          number: this.courseProp,
          icon: "bank",
          color: "#fb7293",
        };
        let tempList = [];
        tempList.push(couNumber);
        tempList.push(majNumber);
        tempList.push(colNumber);
        this.sumList = tempList;
        console.log(majNumber);
        console.log(this.sumList);
        console.log(this.majorProp);
        // console.log(this.pieProp);
      },

      /**/
    },

    mounted() {
      this.statisticInfo();
      this.d1 = this.pieProp;
    },
  };
</script>
<style>
  .card_area {
    padding: 10px;
    height: 10px;
  }

  .Card_Info {
    padding-top: 20px;
  }

  .Card_Info2 {
    padding-top: 20px;
  }
</style>
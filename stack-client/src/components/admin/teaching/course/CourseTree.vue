<template>
  <!-- <div id="courseDashboard" style="width: 600px;height:400px;"></div> -->
  <div>
    <a-row>
      <a-col :span="1"></a-col>
      <a-col :span="2">
        <p>this is a tab1</p>
      </a-col>
      <a-col :span="19"></a-col>
      <a-col :span="2">
        <a-button type="primary">Tab1</a-button>
      </a-col>
    </a-row>
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

    <!-- 
      
      <a-col :span="2"></a-col>
      <a-col :span="3">
        <a-card title="学院" size="small" style="width: 300px;text-align:center;border-color: rgb(183, 186, 187);">
          <p>共{{ this.CNum }}个</p>
        </a-card>
      </a-col>
      <a-col :span="2"></a-col>
      <a-col :span="3">
        <a-card title="专业" :majorNum="mNum" size="small"
          style="width: 300px;text-align:center;border-color: rgb(183, 186, 187);">
          <p>共{{this.mNum}}个</p>
        </a-card>
      </a-col>
      <a-col :span="2"></a-col>
      <a-col :span="3">
        <a-card title="课程" :courseNum="cnum" size="small"
          style="width: 300px;text-align:center;border-color: rgb(183, 186, 187);">
          <p>共{{ this.cnum }}个</p>
        </a-card>
      </a-col>
      <a-col :span="2"></a-col>
      <a-col :span="3">
        <a-card title="专业" size="small" style="width: 300px;text-align:center;border-color: rgb(183, 186, 187);">
          <p>共50个</p>
        </a-card>
      </a-col>
    </a-row> -->

    <a-divider style="border-color: rgb(183, 186, 187);" />
    <a-row>
      <a-col :span="4"></a-col>
      <a-col id="courseDashboard" style="height:400px;" :span="6"></a-col>
      <a-col :span="4"></a-col>
      <a-col id="collegeAndcourseDashboard" style="height:400px;" :span="6"></a-col>
    </a-row>
  </div>
</template>

<script>
  import axios from "@/utils/axios";
  export default {
    data() {
      return {
        CNum: 0,
        mNum: 0,
        cnum: 0,
        collegeList:[],
        style:{ icon: 'trophy', color: '#50b8ee' },
        // sunList:this.TreeData
        sumList: [
          { title: "学院", number: '16', icon: 'bank', color: '#ffbf35' },
          { title: "专业", number: '351', icon: 'trophy', color: '#50b8ee' },
          { title: "课程", number: '1264', icon: 'book', color: '#fb7293' },
        ],
        d1: [
                { value: 335, name: '计算机科学学院' },
                { value: 310, name: '马克思主义学院' },
                { value: 274, name: '文学院' },
                { value: 235, name: '数学与信息科学学院' },
                { value: 400, name: '生命科学学院' }
              ]
      }
    },
    props: ['TreeData'],

    // props: ['activeIndex','courses'],
    methods: {
      myEchartsone() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.$echarts.init(
          document.getElementById("courseDashboard")
        );

        // 指定图表的配置项和数据
        var option1 = {
          // backgroundColor: '#2c343c',

          title: {
            text: '陕西师范大学',
            left: 'center',
            top: 20,
            textStyle: {
              color: '#ccc'
            }
          },

          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },

          visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
              colorLightness: [0, 1]
            }
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data:this.d1.sort(function (a, b) { return a.value - b.value; }),
              roseType: 'radius',
              label: {
                color: '#000'
              },
              labelLine: {
                lineStyle: {
                  color: '#000'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              },
              itemStyle: {
                color: '#c23531',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },

              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              }
            }
          ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option1);
      },
      myEchartstwo() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.$echarts.init(
          document.getElementById("collegeAndcourseDashboard")
        );
        
        // 指定图表的配置项和数据
        var option2 = {
          xAxis: {
            type: 'category',
            data: ['计算机科学学院', '马克思主义学院', '文学院', '生命科学学院', '数学与信息科学学院', '哲学与政府管理学院', '心理学院']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
          }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option2);
        console.log("++++++++");
        console.log(this.TreeData);

      },
      getMajorNum() {
        for (let item of this.TreeData) {
          console.log(item);
          this.mNum += item["majors"].length;
          console.log(this.mNum);
        }
        console.log(this.d1);
      },
      getCoursesNum(){
        for(let item of this.TreeData){
          this.cnum+=item["course_number"];
          console.log(this.cnum);
        }
      },
      getCollegeNum(){
        this.CNum=this.TreeData.length;
      },
      getCollege(){
        for(let item in this.TreeData){
          console.log(item);
          this.collegeList.push(item["_id"])
        }
        console.log(this.collegeList);
      }
    },

    mounted() {
      this.myEchartsone();
      this.myEchartstwo();
      this.getMajorNum();
      this.getCollegeNum();
      this.getCoursesNum();
      this.getCollege();
    },
  };
</script>
<style>
  .card_area {
    padding: 10px;
    height: 10px;
  }
</style>
<template>
  <div class="area">
    <a-row class="btn-group">
      <a-col>
        <a-button-group>
          <a-button type="primary">设备状态</a-button>
          <a-button>直播任务设置</a-button>
        </a-button-group>
      </a-col>
    </a-row>
    <a-row class="input">
      <a-col :span="5">
        <a-input-search placeholder="请输入教室编号" enter-button @search="onSearch"/>
      </a-col>
      <a-col :span="14"></a-col>
      <a-col :span="5" class="btn">
        <a-button type="primary">开启</a-button>
        <a-button type="primary">关闭</a-button>
      </a-col>
    </a-row>
    <h3 style="padding-left: 10px;margin-top: 10px;">主楼</h3>
    <a-row class="rone">
      <h4>1层</h4>
      <a-col :span="6" v-for="(item,index) in liveClassroomList" :key="index" src>
        <a-card hoverable style="width: 300px;margin-bottom: 10px;justify-content: space-around;" align="center">
          <a-avatar style="background-color: rgb(59, 145, 10)" :size="64" icon="desktop"></a-avatar>
          <p></p>
          <a-card-meta :description="item.classroomState" class="card_info"></a-card-meta>
          <p></p>
          <a-card-meta :description="item.classroomId"></a-card-meta>

        </a-card>
      </a-col>
    </a-row>
    <a-row class="rtwo">
      <h4>2层</h4>
      <a-col :span="6" v-for="(item,index) in liveClassroomList" :key="index" src>
        <a-card hoverable style="width: 300px;margin-bottom: 10px;justify-content: space-around;" align="center">
          <a-avatar style="background-color: rgb(59, 145, 10)" :size="64" icon="desktop"></a-avatar>
          <p></p>
          <a-card-meta :description="item.classroomState" class="card_info"></a-card-meta>
          <p></p>
          <a-card-meta :description="item.classroomId"></a-card-meta>

        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        liveClassroomList: [
          {
            classroomState: "正在直播",
            classroomId: "0101",
          },
          {
            classroomState: "空闲",
            classroomId: "0102",
          },
          {
            classroomState: "空闲",
            classroomId: "0103",
          },
          {
            classroomState: "空闲",
            classroomId: "0104",
          },
        ]
      };
    },
    methods: {
      onSearch() {},
    },
  }
</script>

<style>
  .area {
    margin-top: 10px;
    margin-left: 10px;

  }

  .input {
    padding-left: 10px;
    padding-top: 10px;
  }

  .btn-group {
    padding-left: 10px;
    padding-top: 10px;
  }

  .rone {
    margin-left: 10px;
  }

  .rtwo {
    margin-left: 20px;
  }

  .btn .ant-btn {
    margin: 0 10px;
  }
</style>
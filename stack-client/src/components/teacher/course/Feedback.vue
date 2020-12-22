<template>
  <div>
    <a-row type="flex" justify="start" :gutter="[0, 18]">
      <a-col
        :span="6"
        :key="item.id"
        v-for="item in classMenu"
        style="display: flex;flex-direction: column;align-items: center;"
      >
        <a-button
          type="primary"
          :icon="item.icon"
          :style="item.style"
          style="width: 8rem; height: 8rem; margin-bottom: 1.5rem; font-size: 3rem;"
          @click="socketChannel(item.action)"
        />
        <span>{{ item.name }}</span>
      </a-col>
    </a-row>
  </div>
</template>

<script>
const colorItems = [
  "blueviolet",
  "#9FE6B8",
  "#FFDB5C",
  "#ff9f7f",
  "#fb7293",
  "#8378EA",
  "#96BFFF",
  "#e7bcf3",
  "#9d96f5",
  "#f56a00",
  "#7265e6",
  "#ffbf00",
  "#00a2ae",
];
export default {
  name: "GridView4",
  data() {
    return {
      classMenu: [
        {
          id: 1,
          name: "签到",
          icon: "carry-out",
          action: "sign",
          style: { backgroundColor: colorItems[1], borderColor: colorItems[1] },
        },
        {
          id: 2,
          name: "随堂测试",
          icon: "bulb",
          action: "quiz",
          style: { backgroundColor: colorItems[2], borderColor: colorItems[2] },
        },
        {
          id: 3,
          name: "随机点名",
          icon: "alert",
          action: "random",
          style: { backgroundColor: colorItems[3], borderColor: colorItems[3] },
        },
        {
          id: 4,
          name: "问卷",
          icon: "solution",
          action: "questionnaire",
          style: { backgroundColor: colorItems[4], borderColor: colorItems[4] },
        },
        {
          id: 5,
          name: "投票",
          icon: "tags",
          action: "vote",
          style: { backgroundColor: colorItems[5], borderColor: colorItems[5] },
        },
        // {
        //     id: 6,
        //     name: '随堂测试',
        //     icon: 'bulb',
        //     action: 'test',
        //     style: { backgroundColor: colorItems[6], borderColor: colorItems[6] },
        // },
        {
          id: 7,
          name: "文件下发",
          icon: "container",
          action: "file",
          style: { backgroundColor: colorItems[7], borderColor: colorItems[7] },
        },
      ],
    };
  },
  mounted() {
    socketio.addEventListener({
      type: "message",
      callback: (message) => {
        console.log(message);
      },
    });
  },
  methods: {
    socketChannel(value) {
      console.log(value);
      socketio.sendEvent({
        type: "message",
        data: {
          message: "this is a test",
          sent: Date.now(),
        },
      });
    },
  },
};
</script>

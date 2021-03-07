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

const state = {
  user: {},
  openRooms: [],
  interaction: {
    sign: { start: false, endTime: 0 },
    vote: { start: false },
    test: { questions: [] },
    race: { start: false, question: {} },
    file: { fileList: [] },
    ask: {},
    randomSign: { start: false, endTime: 0, randomStudent: "" },
  },
  //student
  //首页目录分区
  courseMenu: [
    {
      id: 1,
      name: "我的课程",
      icon: "book",
      route: "/student/course",
      style: { backgroundColor: colorItems[1], borderColor: colorItems[1] },
      badge: false,
    },
    {
      id: 2,
      name: "学情分析",
      icon: "calculator",
      route: "/student/analysis",
      style: { backgroundColor: colorItems[2], borderColor: colorItems[2] },
      badge: false,
    },
    {
      id: 3,
      name: "我的收藏",
      icon: "heart",
      route: "/student/favorite",
      style: { backgroundColor: colorItems[3], borderColor: colorItems[3] },
      badge: false,
    },
    // {
    //     id: 4,
    //     name: '课程直播',
    //     icon: 'play-square',
    //     route: '/student/live',
    //     style: { backgroundColor: colorItems[4], borderColor: colorItems[4] },
    // },
  ],
  userMenu: [
    {
      id: 1,
      name: "个人资料",
      icon: "smile",
      route: "user",
      style: { backgroundColor: colorItems[5], borderColor: colorItems[5] },
      badge: false,
    },
    {
      id: 2,
      name: "修改密码",
      icon: "key",
      route: "password",
      style: { backgroundColor: colorItems[6], borderColor: colorItems[6] },
      badge: false,
    },
    // {
    //   id: 3,
    //   name: "督导巡课",
    //   icon: "message",
    //   route: "message",
    //   style: { backgroundColor: colorItems[7], borderColor: colorItems[7] },
    // },
  ],
  badge: {
    sign:true,
  },
  classMenu: [
    {
      id: 1,
      name: "签到",
      icon: "carry-out",
      route: "sign",
      style: { backgroundColor: colorItems[1], borderColor: colorItems[1] },
      badge: false,
    },
    {
      id: 2,
      name: "随堂测试",
      icon: "bulb",
      route: "quiz",
      style: { backgroundColor: colorItems[2], borderColor: colorItems[2] },
      badge: false,
    },
    {
      id: 3,
      name: "随机点名",
      icon: "alert",
      route: "random",
      style: { backgroundColor: colorItems[3], borderColor: colorItems[3] },
      badge: false,
    },
    {
      id: 4,
      name: "文件下发",
      icon: "solution",
      route: "file",
      style: { backgroundColor: colorItems[4], borderColor: colorItems[4] },
      badge: false,
    },
    {
      id: 5,
      name: "投票",
      icon: "tags",
      route: "vote",
      style: { backgroundColor: colorItems[5], borderColor: colorItems[5] },
      badge: false,
    },
    {
      id: 6,
      name: "随堂提问",
      icon: "bulb",
      route: "test",
      style: { backgroundColor: colorItems[6], borderColor: colorItems[6] },
      badge: false,
    },
    {
      id: 7,
      name: "抢答",
      icon: "hourglass",
      route: "race",
      style: { backgroundColor: colorItems[7], borderColor: colorItems[7] },
      badge: false,
    },
    // {
    //   id: 6,
    //   name: "文件下发",
    //   icon: "container",
    //   route: "file",
    //   style: { backgroundColor: colorItems[6], borderColor: colorItems[6] },
    // },
  ],
  classList: [],
  courseList: [
    // {
    //   course_id: 2,
    //   course_name: "Technology",
    //   teacher: "Luke",
    //   time: "1-12week",
    //   week: 5,
    //   classroom: "W Building 1602",
    //   style: { backgroundColor: colorItems[2], borderColor: colorItems[2] },
    // },
    // {
    //   course_id: 3,
    //   course_name: "History",
    //   teacher: "Erica",
    //   time: "2-28week",
    //   week: 3,
    //   classroom: "",
    //   style: { backgroundColor: colorItems[3], borderColor: colorItems[3] },
    // },
    // {
    //   course_id: 4,
    //   course_name: "JQery course",
    //   teacher: "Sam",
    //   time: "2-28week",
    //   week: 2,
    //   classroom: "",
    //   style: { backgroundColor: colorItems[4], borderColor: colorItems[4] },
    // },
    // {
    //   course_id: 5,
    //   course_name: "SpringBoot",
    //   teacher: "Sam",
    //   time: "2-28week",
    //   week: 3,
    //   classroom: "",
    //   style: { backgroundColor: colorItems[5], borderColor: colorItems[5] },
    // },
    // {
    //   course_id: 6,
    //   course_name: "Python bootcamp",
    //   teacher: "Sam",
    //   time: "2-28week",
    //   week: 4,
    //   classroom: "",
    //   style: { backgroundColor: colorItems[6], borderColor: colorItems[6] },
    // },
  ],
  resList: [
    //0 可下载资源，1 试卷，2 可在线看的视频
    // { id: "r00", resType: 0, isFinish: false, title: "PPT", isFav: true },
    // { id: "r01", resType: 1, isFinish: true, title: "quiz", isFav: false },
    // { id: "r02", resType: 2, isFinish: false, title: "MP4", isFav: true },
  ],
  examList: [
    // {
    //   id: "b8e0ac50-000",
    //   isFinish: false,
    //   resType: 0,
    //   title: "examination 1",
    //   task_type: "exam",
    //   deadline: "2021-02-19 14:02",
    //   score: 0,
    //   questions: [
    //     {
    //       content: "question 1",
    //       options: [
    //         { value: "A", text: "aaaaa" },
    //         { value: "B", text: "bbbbb" },
    //         { value: "C", text: "ccccc" },
    //         { value: "D", text: "ddddd" },
    //       ],
    //       answer: ["A"],
    //     },
    //     {
    //       content: "question 2",
    //       options: [
    //         { value: "A", text: "aaaaa" },
    //         { value: "B", text: "bbbbb" },
    //         { value: "C", text: "ccccc" },
    //         { value: "D", text: "ddddd" },
    //         { value: "E", text: "eeeee" },
    //       ],
    //       answer: ["A", "E"],
    //     },
    //   ],
    // },

  ],
  homeworkList: [
    // {
    //   hid: "1",
    //   resType: 0,
    //   isFinish: false,
    //   title: "homework 1",
    //   lid: "1",
    //   cid: "1",
    //   content: "content",
    //   attachment_url: "",
    // },
  ],
  favResList: [
    { id: "r00", resType: 0, isFinish: false, title: "PPT", isFav: true },
    { id: "r02", resType: 2, isFinish: false, title: "MP4", isFav: true },
  ],
};

export default state;

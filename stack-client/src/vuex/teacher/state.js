const state = {
  courseCalendar: [],
  today: { title: "", day: "" },
  weekTable: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  lessonNames: [],
  // interaction data
  signList: [],
  randomList: [],
  ask_answer: [],
  testAnswerList: [],
  voteAnswerList: [],
  precourse: {},
  curActivity: "sign",
  onlineList: [],
  randomStudent: "",
  randomStudents: [],
  raceList: [],
  // precourse data
  courses: [],
  courseHours: [],
  curCourseHour: 0,
  nodes: [],
  nodeindex: 0,
  sources: [],
  questionBank: [],
  questionOfPaper: [],
  updatePapers: [],
  updateSetHomeworks: [],
  // courseinfo
  courseInfo: {},

};

export default state;

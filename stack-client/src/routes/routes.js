const IndexPage = () => import("@/components/index/IndexPage");

// ---------------------  supervisor router  ------------------------------
const SupervisorRouter = () =>
  import("@/components/supervisor/index/SupervisorRouter");
const SupervisorAdmin = () =>
  import("@/components/supervisor/admin/AdminManagement");
const SupervisorSchool = () =>
  import("@/components/supervisor/school/SchoolManagement");

// ---------------------  admin router  -----------------------------------
const AdminRouter = () => import("@/components/admin/index/AdminRouter");
const AdminResource = () =>
  import("@/components/admin/resource/ResourceManagement");

// 教学信息管理
// const AdminSemester = () =>
//   import("@/components/admin/teaching/semester/Semester");

const AdminTimetable = () =>
  import("@/components/admin/teaching/timetable/Timetable");
const AdminSpace = () => import("@/components/admin/teaching/space/Space");
const AdminInstitution = () =>
  import("@/components/admin/teaching/institution/Institution");
const AdminClassInfo = () =>
  import("@/components/admin/teaching/institution/ClassInfo");
const AdminTeacher = () =>
  import("@/components/admin/teaching/teacher/Teacher");
const AdminCourse = () => import("@/components/admin/teaching/course/Course");
const AdminSchedule = () =>
  import("@/components/admin/teaching/schedule/Schedule");
const AdminConnection = () =>
  import("@/components/admin/teaching/connection/connect");
// 设备管理
const AdminInstallation = () =>
  import("@/components/admin/device/installation/Installation");
const AdminUpgrade = () => import("@/components/admin/device/upgrade/Upgrade");

// ------------------------  teacher router  ------------------------------
const TeacherRouter = () => import("@/components/teacher/index/TeacherRouter");
const TeacherIndex = () => import("@/components/teacher/index/IndexPage");
// const TeacherCourse = () => import("@/components/teacher/course/Index");
const TeacherCourseDetail = () =>
  import("@/components/teacher/coursedetail/index/CourseDetail");
const TeacherPreCourse = () =>
  import("@/components/teacher/precourse/PreCourse");

// -----------------------  student router  -------------------------------
// const landPage = () => import("@/pages/LandingPage.vue");
const studentHome = () => import("@/pages/student/StudentHomePage.vue");
const studentNavigator = () =>
  import("@/pages/student/StudentNavigatorPage.vue");

const courseCatalog = () => import("@/pages/student/menu/CourseCatalog.vue");

const courseHome = () => import("@/pages/student/course/CourseHome.vue");
const courseDetail = () => import("@/pages/student/course/CourseDetail.vue");
const videoPage = () => import("@/pages/student/course/Video.vue");
const homework = () => import("@/pages/student/course/Homework.vue");
const exam = () => import("@/pages/student/course/Exam.vue");

const userProfile = () => import("@/pages/student/user/UserProfile.vue");
const password = () => import("@/pages/student/user/Password.vue");
const message = () => import("@/pages/student/user/Message.vue");

const favorite = () => import("@/pages/student/menu/Favorite.vue");
const analysis = () => import("@/pages/student/menu/Analysis.vue");

const sign = () => import("@/pages/student/course/class/Sign.vue");
const test = () => import("@/pages/student/course/class/Test.vue");
const random = () => import("@/pages/student/course/class/Random.vue");
const questionnaire = () =>
  import("@/pages/student/course/class/Questionnaire.vue");
const vote = () => import("@/pages/student/course/class/Vote.vue");
const ques = () => import("@/pages/student/course/class/Ques.vue");
const file = () => import("@/pages/student/course/class/File.vue");
const live = () => import("@/pages/student/course/Live");

// ----------------  interaction router --------------------------
const Interaction = () =>
  import("@/components/teacher/interaction/InteractionRouter");
const InteractionIndex = () => import("@/components/teacher/interaction/Index");
// const InteractionLive = () => import("@/components/teacher/interaction/Live");
// const InteractionVote = () => import("@/components/teacher/interaction/Vote");
// const InteractionPick = () => import("@/components/teacher/interaction/Pick");
// const InteractionRace = () => import("@/components/teacher/interaction/Race");
// const InteractionSign = () => import("@/components/teacher/interaction/Sign");
// const InteractionTest = () => import("@/components/teacher/interaction/Test");
// const InteractionFile = () => import("@/components/teacher/interaction/File");
// const InteractionQues = () => import("@/components/teacher/interaction/Ques");

// ----------------  patrol router --------------------------
const patrolRoute = () => import("@/components/patrol/index.vue");
const patrolMessage = () => import("@/components/patrol/patrolMessage.vue");
const Detailed = () => import("@/components/patrol/patrolMessage/patrolDetailed.vue");

export const routes = [
  {
    path: "/",
    name: "index",
    component: IndexPage,
  },
  {
    path: "/admin",
    component: AdminRouter,
    children: [
      {
        path: "resource",
        name: "admin_resource",
        component: AdminResource,
      },
      {
        path: "institution",
        name: "admin_institution",
        component: AdminInstitution,
      },
      {
        path: "classinfo",
        name: "admin_classinfo",
        component: AdminClassInfo,
        props: (route) => ({ query: route.query.classId }),
      },
      {
        path: "course",
        name: "admin_course",
        component: AdminCourse,
      },
      {
        path: "schedule",
        name: "admin_schedule",
        component: AdminSchedule,
      },
      {
        path: "space",
        name: "admin_space",
        component: AdminSpace,
      },
      {
        path: "teacher",
        name: "admin_teacher",
        component: AdminTeacher,
      },
      {
        path: "timetable",
        name: "admin_timetable",
        component: AdminTimetable,
      },
      // {
      //   path: "semester",
      //   name: "admin_semester",
      //   component: AdminSemester,
      // },
      {
        path: "installation",
        name: "admin_installation",
        component: AdminInstallation,
      },
      {
        path: "upgrade",
        name: "admin_upgrade",
        component: AdminUpgrade,
      },
      {
        path: "connection",
        name: "admin_connection",
        component: AdminConnection,
      },
    ],
  },
  {
    path: "/supervisor",
    component: SupervisorRouter,
    children: [
      {
        path: "admin",
        name: "supervisor_admin",
        component: SupervisorAdmin,
      },
      {
        path: "school",
        name: "supervisor_school",
        component: SupervisorSchool,
      },
    ],
  },
  {
    path: "/teacher",
    name: "teacher",
    component: TeacherRouter,
    children: [
      {
        path: "index",
        name: "teacher_index",
        component: TeacherIndex,
      },
      // {
      //   path: "course",
      //   name: "teacher_course",
      //   component: TeacherCourse,
      // },
      {
        path: "coursedetail",
        name: "teacher_coursedetail",
        component: TeacherCourseDetail,
        props: (route) => ({ query: route.query.courseId }),
      },
      {
        path: "precourse",
        name: "teacher_precourse",
        component: TeacherPreCourse,
        props: (route) => ({ query: route.query.courseId }),
      },
    ],
  },
  // {
  //   path: "/signin",
  //   component: landPage,
  // },
  {
    path: "/student/home",
    component: studentHome,
  },
  {
    path: "/student",
    component: studentNavigator,
    children: [
      {
        path: "course",
        component: courseCatalog,
      },
      {
        path: "course/:id",
        component: courseHome,
        children: [
          {
            path: "/",
            component: courseDetail,
          },
          {
            path: "sign",
            component: sign,
          },
          {
            path: "test",
            component: test,
          },
          {
            path: "random",
            component: random,
          },
          {
            path: "questionnaire",
            component: questionnaire,
          },
          {
            path: "vote",
            component: vote,
          },
          {
            path: "ques",
            component: ques,
          },
          {
            path: "file",
            component: file,
          },
          {
            path: "video/:id",
            component: videoPage,
          },
          {
            path: "homework",
            component: homework,
          },
          {
            path: "exam/:id",
            component: exam,
          },
        ],
      },
      {
        path: "favorite",
        component: favorite,
      },
      {
        path: "analysis",
        component: analysis,
      },
      {
        path: "user",
        component: userProfile,
      },
      {
        path: "password",
        component: password,
      },
      {
        path: "message",
        component: message,
      },
      // {
      //   path: "live",
      //   component: live,
      // },
    ],
  },
  {
    path: "/interaction",
    name: "interaction",
    component: Interaction,
    children: [
      { path: "index", component: InteractionIndex, name: "interaction_index" },
      // { path: "live", component: InteractionLive, name: "interaction_live" },
      // { path: "pick", component: InteractionPick, name: "interaction_pick" },
      // { path: "race", component: InteractionRace, name: "interaction_race" },
      // { path: "sign", component: InteractionSign, name: "interaction_sign" },
      // { path: "file", component: InteractionFile, name: "interaction_file" },
      // { path: "ques", component: InteractionQues, name: "interaction_ques" },
    ],
  },
  {
    path: "/patrol",
    component: patrolRoute,
    children: [
      { path: "", component: patrolMessage, name: "patrolMessage" },
      { path: "detail", component: Detailed, name: "patrol_detailed" },
    ],
  },
];

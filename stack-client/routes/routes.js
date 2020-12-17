const studentHome = () => import ('@/pages/student/StudentHomePage.vue');
const studentNavigator = () => import ('@/pages/student/StudentNavigatorPage.vue');

const courseCatalog = () => import ('@/pages/student/menu/CourseCatalog.vue');

const courseHome = () => import ('@/pages/student/course/CourseHome.vue');
const courseDetail = () => import ('@/pages/student/course/CourseDetail.vue');
const videoPage = () => import ('@/pages/student/course/Video.vue');
const homework = () => import ('@/pages/student/course/Homework.vue');

const userProfile = () => import ('@/pages/student/user/UserProfile.vue');
const password = () => import ('@/pages/student/user/Password.vue');
const message = () => import ('@/pages/student/user/Message.vue');

const favorite = () => import ('@/pages/student/menu/Favorite.vue');
const analysis = () => import ('@/pages/student/menu/Analysis.vue');

const sign = () => import ('@/pages/student/course/class/Sign.vue');
const quiz = () => import ('@/pages/student/course/class/Quiz.vue');
const random = () => import ('@/pages/student/course/class/Random.vue');
const questionnaire = () => import ('@/pages/student/course/class/Questionnaire.vue');
const vote = () => import ('@/pages/student/course/class/Vote.vue');
const test = () => import ('@/pages/student/course/class/Test.vue');
const file = () => import ('@/pages/student/course/class/File.vue');


export const routes = [
  {
    path: "/",
    component: studentHome,
  },
  {
    path: "/student/home",
    component: studentHome,
  },
  {
      path: '/student',
      component: studentNavigator, children: [
        {
          path: 'course',
          component: courseCatalog
        },
        {
          path: 'course/:id',
          component: courseHome, children: [
            {
              path: '/',
              component: courseDetail
            },
            {
              path: 'sign',
              component: sign
            },{
              path: 'quiz',
              component: quiz
            },{
              path: 'random',
              component: random
            },{
              path: 'questionnaire',
              component: questionnaire
            },{
              path: 'vote',
              component: vote
            },{
              path: 'test',
              component: test
            },{
              path: 'file',
              component: file
            },
            {
              path: 'video/:id',
              component: videoPage
            },{
              path: 'homework',
              component: homework
            },
          ]
        },
        {
          path: 'favorite',
          component: favorite
        },
        {
          path: 'analysis',
          component: analysis
        },
        {
          path: 'user',
          component: userProfile
        },
        {
          path: 'password',
          component: password
        },
        {
          path: 'message',
          component: message
        },
      ]
    },
];
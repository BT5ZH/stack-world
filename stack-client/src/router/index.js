import studentHome from '../pages/student/StudentHomePage.vue';
import studentNavigator from '../pages/student/StudentNavigatorPage.vue';

import courseCatalog from "../pages/student/menu/CourseCatalog.vue";
import courseHome from "../pages/student/course/CourseHome.vue";

import courseDetail from "../pages/student/course/CourseDetail.vue";
import videoPage from "../pages/student/course/Video.vue";
import homework from "../pages/student/course/Homework.vue";

import sign from "../pages/student/course/class/Sign.vue";
import quiz from "../pages/student/course/class/Quiz.vue";
import random from "../pages/student/course/class/Random.vue";
import questionnaire from "../pages/student/course/class/Questionnaire.vue";
import vote from "../pages/student/course/class/Vote.vue";
import test from "../pages/student/course/class/Test.vue";
import file from "../pages/student/course/class/File.vue";


import userProfile from "../pages/student/user/UserProfile.vue";
import password from "../pages/student/user/Password.vue";
import message from "../pages/student/user/Message.vue";


import favorite from '../pages/student/menu/Favorite.vue';
import analysis from "../pages/student/menu/Analysis.vue";


export const routes = [
  {
    path: "/student/home",
    component: studentHome,
  },
  {
      path: '/student/',
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
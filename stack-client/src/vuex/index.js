import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import SuperAction from "./super/action";
import SuperGetter from "./super/getter";
import SuperMutation from "./super/mutation";
import SuperState from "./super/state";

import AdminAction from "./admin/action";
import AdminGetter from "./admin/getter";
import AdminMutation from "./admin/mutation";
import AdminState from "./admin/state";

import StudentAction from "./student/action";
import StudentGetter from "./student/getter";
import StudentMutation from "./student/mutation";
import StudentState from "./student/state";

import TeacherAction from "./teacher/action";
import TeacherGetter from "./teacher/getter";
import TeacherMutation from "./teacher/mutation";
import TeacherState from "./teacher/state";



const SuperModule = {
  state: () => ({ ...SuperState }),
  mutations: { ...SuperMutation },
  actions: { ...SuperAction },
  getters: { ...SuperGetter },
};

const AdminModule = {
  state: () => ({ ...AdminState }),
  mutations: { ...AdminMutation },
  actions: { ...AdminAction },
  getters: { ...AdminGetter },
};

const TeacherModule = {
  state: () => ({ ...TeacherState }),
  mutations: { ...TeacherMutation },
  actions: { ...TeacherAction },
  getters: { ...TeacherGetter },
};

const StudentModule = {
  state: () => ({ ...StudentState }),
  mutations: { ...StudentMutation },
  actions: { ...StudentAction },
  getters: { ...StudentGetter },
};

const store = new Vuex.Store({
  modules: {
    admin: AdminModule,
    super: SuperModule,
    teacher: TeacherModule,
    student: StudentModule,
  },
});

export default store;

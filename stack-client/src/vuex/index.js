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

import PublicAction from "./public/action";
import PublicGetter from "./public/getter";
import PublicMutation from "./public/mutation";
import PublicState from "./public/state";

const SuperModule = {
  namespaced: true,
  state: () => ({ ...SuperState }),
  mutations: { ...SuperMutation },
  actions: { ...SuperAction },
  getters: { ...SuperGetter },
};

const AdminModule = {
  namespaced: true,
  state: () => ({ ...AdminState }),
  mutations: { ...AdminMutation },
  actions: { ...AdminAction },
  getters: { ...AdminGetter },
};

const TeacherModule = {
  namespaced: true,
  state: () => ({ ...TeacherState }),
  mutations: { ...TeacherMutation },
  actions: { ...TeacherAction },
  getters: { ...TeacherGetter },
};

const StudentModule = {
  namespaced: true,
  state: () => ({ ...StudentState }),
  mutations: { ...StudentMutation },
  actions: { ...StudentAction },
  getters: { ...StudentGetter },
};

const PublicModule = {
  namespaced: true,
  state: () => ({ ...PublicState }),
  mutations: { ...PublicMutation },
  actions: { ...PublicAction },
  getters: { ...PublicGetter },
};

const store = new Vuex.Store({
  modules: {
    admin: AdminModule,
    super: SuperModule,
    teacher: TeacherModule,
    student: StudentModule,
    public: PublicModule,
  },
});

export default store;

import Vue from "vue";
import Vuex from "vuex";
import StudentState from "./student/state.js";
import StudentGetters from "./student/getters.js";
import StudentMutations from "./student/mutations.js";
import StudentActions from "./student/actions.js";

Vue.use(Vuex);

const StudentModule = {
  state: () => ({ ...StudentState }),
  mutations: { ...StudentMutations },
  actions: { ...StudentActions },
  getters: { ...StudentGetters },
};

export const store = new Vuex.Store({
  modules: {
    student: StudentModule,
  },
});

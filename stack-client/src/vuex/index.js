import Vue from "vue";
import Vuex from "vuex";
import AdminAction from "./admin/action";
import AdminGetter from "./admin/getter";
import AdminMutation from "./admin/mutation";
import AdminState from "./admin/state";

Vue.use(Vuex);

const AdminModule = {
  state: () => ({ ...AdminState }),
  mutations: { ...AdminMutation },
  actions: { ...AdminAction },
  getters: { ...AdminGetter },
};

const store = new Vuex.Store({
  modules: {
    admin: AdminModule,
  },
});

export default store;
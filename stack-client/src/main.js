import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import { routes } from "../routes/routes";

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.use(Antd);
Vue.use(VueRouter);
Vue.config.productionTip = false;
const router = new VueRouter({
  routes,
  mode: "history",
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

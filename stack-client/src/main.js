import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import { routes } from "./routes/routes.js";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import store from "./vuex/index";

import echarts from "echarts";
import axios from "axios";

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;

Vue.use(VueRouter);
Vue.use(Antd);

Vue.prototype.axios = axios;
Vue.config.productionTip = false;

const router = new VueRouter({
  routes,
  mode: "history",
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

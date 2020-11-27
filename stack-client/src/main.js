import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import { routes } from "./routes/routes";
import store from "./vuex/index";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';

Vue.use(Antd);
Vue.use(VueRouter);

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

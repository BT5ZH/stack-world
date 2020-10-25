import Hello from "../src/components/HelloWorld.vue";
import Other from "../src/components/OtherPage.vue";
export const routes = [
  {
    path: "/",
    component: Hello,
  },
  {
    path: "/other",
    component: Other,
  },
];

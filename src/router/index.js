import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/home.vue"),
    redirect: "/home/task",
    children: [
      {
        path: "task",
        name: "task",
        component: () => import("../components/Task.vue"),
      },
      {
        path: "configuration",
        name: "configuration",
        component: () => import("../components/Configuration.vue"),
      },
      {
        path: "test",
        name: "test",
        component: () => import("../components/FlowChart.vue"),
      }
    ],
  },
];

const router = new createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

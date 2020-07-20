import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: () => import("@/components/layouts/AppLayout.vue"),
      children: [
        {
          name: "Dashboard",
          path: "",
          component: () => import("./views/Dashboard.vue"),
        },
        {
          name: "User Profile",
          path: "profile",
          component: () => import("./views/UserProfile.vue"),
        },
      ],
    },
  ],
});

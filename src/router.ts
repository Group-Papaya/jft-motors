import Vue from "vue";
import Router from "vue-router";
import { auth } from './services/auth.service';

Vue.use(Router);

const router = new Router({
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
          component: () => import("@/views/Dashboard.vue"),
        },
        {
          name: "User Profile",
          path: "profile",
          component: () => import("@/views/UserProfile.vue"),
        },
      ],
    },
    {
      path: "/auth/",
      component: () => import("@/components/layouts/AppMain.vue"),
      children: [
        {
          name: "Login",
          path: "login",
          component: () => import("@/views/Login.vue"),
          meta: {
            allowAnonymous: true,
          },
        },
        {
          name: "Register",
          path: "register",
          component: () => import("@/views/Register.vue"),
          meta: {
            allowAnonymous: true,
          },
        },
        {
          name: "Forgot Password",
          path: "forgot-password",
          component: () => import("@/views/ForgotPassword.vue"),
          meta: {
            allowAnonymous: true,
          },
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (!to.meta.allowAnonymous && !auth.isAuthenticated()) {
    next({
      path: "/auth/login",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;

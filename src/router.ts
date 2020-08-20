import Vue from "vue";
import Router from "vue-router";
import store from "./store";

Vue.use(Router);

const isAuthenticated = () => store.getters.isAuthenticated;

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: () => import("@/components/layouts/AppLayout.vue"),
      meta: {
        requiresAuth: true
      },
      beforeEnter(to, from, next) {
        if (isAuthenticated()) {
          next();
        } else {
          next("/auth/login");
        }
      },
      children: [
        {
          name: "Dashboard",
          path: "",
          component: () => import("@/views/Dashboard.vue")
        },
        {
          name: "User Profile",
          path: "profile",
          component: () => import("@/views/UserProfile.vue")
        }
      ]
    },
    {
      path: "/auth/",
      component: () => import("@/components/layouts/AppMain.vue"),
      beforeEnter(to, from, next) {
        if (isAuthenticated()) {
          if (to.fullPath.includes("forgot-password")) next();
          else next("/");
        } else {
          next();
        }
      },
      children: [
        {
          name: "Login",
          path: "login",
          component: () => import("@/views/Login.vue")
        },
        {
          name: "Register",
          path: "register",
          component: () => import("@/views/Register.vue")
        },
        {
          name: "Forgot Password",
          path: "forgot-password",
          component: () => import("@/views/ForgotPassword.vue")
        }
      ]
    }
  ]
});

export default router;

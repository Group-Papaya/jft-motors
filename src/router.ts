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
          component: () => import("@/views/Dashboard.vue")
        },
        {
          name: "Quotations",
          path: "quotations",
          component: () => import("@/views/Quotations.vue")
        },
        {
          name: "Invoices",
          path: "invoices",
          component: () => import("@/views/Invoices.vue")
        },
        {
          name: "Clients",
          path: "clients",
          component: () => import("@/views/Clients.vue")
        },
        {
          name: "Discounts",
          path: "discounts",
          component: () => import("@/views/Discounts.vue")
        },
        {
          name: "LineItems",
          path: "line-items",
          component: () => import("@/views/LineItems.vue")
        },
        {
          name: "Users",
          path: "users",
          component: () => import("@/views/Users.vue")
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

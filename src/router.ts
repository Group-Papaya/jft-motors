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
      component: () =>
        import(
          /* webpackChunkName: "app-layout" */ "@/components/layouts/AppLayout.vue"
        ),
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
          component: () =>
            import(
              /* webpackChunkName: "app-dashboard" */ "@/views/Dashboard.vue"
            )
        },
        {
          name: "Quotations",
          path: "quotations",
          component: () => import("@/views/Quotations.vue")
        },
        {
          path: "quotations/:id",
          component: () => import("@/views/QuotationEditor.vue")
        },
        {
          name: "Invoices",
          path: "invoices",
          component: () => import("@/views/Invoices.vue")
        },
        {
          path: "invoices/:id",
          component: () => import("@/views/QuotationEditor.vue")
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
          component: () =>
            import(
              /* webpackChunkName: "app-profile" */ "@/views/UserProfile.vue"
            )
        }
      ]
    },
    {
      path: "/auth/",
      component: () =>
        import(
          /* webpackChunkName: "app-main" */ "@/components/layouts/AppMain.vue"
        ),
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
          component: () =>
            import(/* webpackChunkName: "auth-login" */ "@/views/Login.vue")
        },
        {
          name: "Register",
          path: "register",
          component: () =>
            import(
              /* webpackChunkName: "auth-register" */ "@/views/Register.vue"
            )
        },
        {
          name: "Forgot Password",
          path: "forgot-password",
          component: () =>
            import(
              /* webpackChunkName: "auth-forgot" */ "@/views/ForgotPassword.vue"
            )
        }
      ]
    }
  ]
});

export default router;

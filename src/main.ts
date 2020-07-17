import Vue from "vue";
import App from "./App.vue";
import "./firebase";
import router from "./router";
import "./service-worker";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

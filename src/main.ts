import Vue from "vue";
import App from "./App.vue";
import "./firestore";
import "./plugins/base";
import "./plugins/validate";
import vuetify from "./plugins/vuetify";
import router from "./router";
import "./service-worker";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");

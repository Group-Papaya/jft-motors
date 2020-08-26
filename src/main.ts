import Vue from "vue";
import App from "./App.vue";
import "./firebase";
import "./plugins/base";
import "./plugins/vue2-filters";
import vuetify from "./plugins/vuetify";
import router from "./router";
import "./service-worker";
import store from "./store";
import "./assets/main.scss";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");

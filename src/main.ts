import Vue from "vue";
import App from "./App.vue";
import "./assets/main.scss";
import "./firebase";
import "./plugins/base";
import "./plugins/vue2-filters";
import vuetify from "./plugins/vuetify";
import "./plugins/vuetify-dialog";
import router from "./router";
import "./service-worker";
import { watchCollection } from "./services/curd.service";
import store from "./store";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

Vue.config.productionTip = false;

const settings = watchCollection("settings", data => {
  store.commit("SET_REGISTERED", data.length > 0);
  store.commit("SET_RECORDS", { settings: data });
});

const users = watchCollection("users", data =>
  store.commit("SET_RECORDS", { users: data })
);

const clients = watchCollection("clients", data =>
  store.commit("SET_RECORDS", { clients: data })
);

const discounts = watchCollection("discounts", data =>
  store.commit("SET_RECORDS", { discounts: data })
);

const lineitems = watchCollection("line-items", data =>
  store.commit("SET_RECORDS", { lineitems: data })
);

const quotations = watchCollection("quotations", data =>
  store.commit("SET_RECORDS", { quotations: data })
);

Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 5,
  newestOnTop: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  timeout: 5000,
  closeOnClick: true
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  beforeDestroy: () => {
    users();
    clients();
    discounts();
    lineitems();
    quotations();
    settings();
  }
}).$mount("#app");

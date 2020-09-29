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
import {
  getDocument,
  watchCollection,
  watchDocument
} from "./services/curd.service";
import store from "./store";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "vuetify/dist/vuetify.min.css";
import { storage } from "@/firebase";

Vue.config.productionTip = false;

const details = watchDocument(
  { path: "settings/business-details" },
  async document => {
    const logo = await storage
      .ref("/logo.png")
      .getDownloadURL()
      .then(url => url)
      .catch(reason => {
        console.warn({ ERROR: reason }, "Can't Find the Company logo");
        return require("./assets/logo.png");
      });
    store.commit("SET_DETAILS", { ...document, logo });
  }
);

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
  beforeCreate() {
    getDocument("settings/business-details")
      .get()
      .then(doc => store.commit("SET_REGISTERED", doc.exists));
    getDocument("settings/business-rules")
      .get()
      .then(doc => store.commit("SET_RULES", doc.data()));
  },
  beforeDestroy: () => {
    users();
    details();
    clients();
    discounts();
    lineitems();
    quotations();
  }
}).$mount("#app");

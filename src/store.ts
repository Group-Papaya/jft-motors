import { Client, Discount, Quotation, User } from "@/models";
import { auth } from "@/services/auth.service";
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { curd } from "./services/curd.service";
import moment from "moment";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    barColor: "rgba(0, 0, 0)",
    barImage: require("@/assets/background.jpg"),
    rules: {},
    drawer: null,
    details: {
      logo: "",
      company: "",
      telephone: "",
      address: {
        city: "",
        street: "",
        suburb: "",
        zipcode: 0o000,
        country: ""
      },
      settings: {
        discounts: {}
      }
    },
    registered: true,
    auth: {
      user: User,
      authenticated: auth.user ? !auth.user.isAnonymous : false
    },
    records: {
      users: Array<User>(),
      clients: Array<Client>(),
      discounts: Array<Discount>(),
      quotations: Array<Quotation>()
    }
  },
  getters: {
    isAuthenticated: state => {
      return state.auth.authenticated;
    },
    invoices: state => {
      return state.records.quotations.filter(it => it.completed);
    },
    drafts: state => {
      return state.records.quotations.filter(it => !it.completed);
    },
    getQuotation: state => (id: string) => {
      return state.records.quotations.find(it => it.id === id);
    },
    getUser: state => (id: string) => {
      return state.records.users.find(user => user.id === id);
    },
    getClient: state => (path: string) => {
      return state.records.clients.find(client => client.path === path);
    },
    currentUser: state => {
      return state.auth.user;
    },
    discounts: state => {
      return state.details.settings.discounts;
    }
  },
  mutations: {
    SET_REGISTERED(state, payload) {
      state.registered = payload;
    },
    SET_AUTH_STATE(state, payload) {
      state.auth = payload;
    },
    SET_DETAILS(state, payload) {
      state.details = payload;
    },
    SET_RULES(state, payload) {
      state.rules = payload;
    },
    SET_RECORDS(state, payload) {
      state.records = {
        ...state.records,
        ...payload
      };
    },
    SET_DRAWER(state, payload) {
      state.drawer = payload;
    }
  },
  actions: {
    ADD_QUOTATION({ getters, dispatch }, quotation: Quotation) {
      const client = quotation.meta.client;
      const user = getters.currentUser;
      dispatch("ADD_RECORD", {
        record: {
          ...quotation,
          items: [],
          total: 0,
          format: "R0",
          completed: false,
          user: `${user.firstname} ${user.lastname}`,
          client: `${client.firstname} ${client.lastname}`,
          created: moment().format("MMMM Do YYYY"),
          updated: moment().format("MMMM Do YYYY"),
          meta: {
            user: user,
            client: client,
            ...quotation.meta
          }
        },
        path: "quotations"
      });
    },
    ADD_RECORD({ dispatch }, { record, path, ref = undefined }) {
      curd.add(record, path, ref).then(ref => {
        dispatch("SET_RECORD", {
          record: { ...record, id: ref.id },
          path: ref.path
        });
      });
    },
    SET_RECORD(_, { record, path, ref = undefined }) {
      return curd.update(record, path, ref);
    }
  },
  plugins: [createPersistedState()]
});

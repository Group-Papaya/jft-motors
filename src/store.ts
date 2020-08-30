import { Discount, User } from "@/models";
import { auth } from "@/services/auth.service";
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { vuexfireMutations } from "vuexfire";
import { curd } from "./services/curd.service";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    barColor: "rgba(0, 0, 0)",
    barImage: require("@/assets/background.jpg"),
    drawer: null,
    auth: {
      user: auth.user,
      authenticated: auth.user ? !auth.user.isAnonymous : false
    },
    records: {
      users: Array<User>(),
      discounts: Array<Discount>()
    }
  },
  getters: {
    isAuthenticated: state => {
      return state.auth.authenticated;
    }
  },
  mutations: {
    SET_AUTH_STATE(state, payload) {
      state.auth = payload;
    },
    SET_BAR_IMAGE(state, payload) {
      state.barImage = payload;
    },
    SET_RECORDS(state, payload) {
      state.records = {
        ...state.records,
        ...payload
      };
    },
    SET_DRAWER(state, payload) {
      state.drawer = payload;
    },
    ...vuexfireMutations
  },
  actions: {
    ADD_RECORD({ dispatch }, { record, path, ref = undefined }) {
      curd.add(record, path, ref).then(ref => {
        dispatch("SET_RECORD", {
          record: { ...record, id: ref.id },
          path: ref.path
        });
      });
    },
    SET_RECORD(_, { record, path, ref = undefined }) {
      curd.update(record, path, ref);
    }
  },
  plugins: [createPersistedState()]
});

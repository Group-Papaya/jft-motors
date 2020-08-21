import { auth } from "@/services/auth.service";
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { vuexfireMutations } from "vuexfire";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    barColor: "rgba(0, 0, 0)",
    barImage: require("@/assets/background.jpg"),
    drawer: null,
    auth: {
      user: auth.user,
      authenticated: auth.user ? !auth.user.isAnonymous : false
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
    SET_DRAWER(state, payload) {
      state.drawer = payload;
    },
    ...vuexfireMutations
  },
  actions: {},
  plugins: [createPersistedState()]
});

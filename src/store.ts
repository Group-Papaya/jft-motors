import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations } from "vuexfire";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    barColor: "rgba(0, 0, 0, .75), rgba(0, 0, 0, .75)",
    barImage: require("@/assets/background.jpg"),
    drawer: null
  },
  mutations: {
    SET_BAR_IMAGE(state, payload) {
      state.barImage = payload;
    },
    SET_DRAWER(state, payload) {
      state.drawer = payload;
    },
    ...vuexfireMutations
  },
  actions: {}
});

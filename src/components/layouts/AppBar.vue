<template>
  <v-app-bar id="app-bar" absolute app color="transparent" flat height="75">
    <v-app-bar-nav-icon class="mr-3" fab @click="setDrawer(!drawer)" />

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="$route.name"
    />

    <v-spacer />

    <div class="mx-3" />

    <v-btn class="ml-2" min-width="0" text to="/">
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>

    <v-btn class="ml-2 mr-2" min-width="0" text to="/profile">
      <v-icon>mdi-account</v-icon>
    </v-btn>
    <v-menu left bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon min-width="0" v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-if="auth.authenticated" @click="logout()">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Sign out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { auth } from "@/services/auth.service";

export default {
  name: "AppBar",

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState(["drawer", "auth"])
  },

  methods: {
    ...mapMutations({
      setDrawer: "SET_DRAWER"
    }),
    logout() {
      auth.logout().then(() => {
        this.$router.replace("/auth/login");
      });
    }
  }
};
</script>

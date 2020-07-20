<template>
  <v-app>
    <app-bar />

    <app-drawer />

    <app-view />
  </v-app>
</template>

<script>
export default {
  name: "AppLayout",

  components: {
    AppBar: () => import("./AppBar"),
    AppDrawer: () => import("./AppDrawer"),
    AppView: () => import("./AppView"),
  },

  data: () => ({
    expandOnHover: false,
  }),
};
</script>

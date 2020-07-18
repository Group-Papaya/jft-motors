<template>
  <v-main>
    <router-view />

    <app-footer />
  </v-main>
</template>

<script>
export default {
  name: "AppView",

  components: {
    AppFooter: () => import("./AppFooter")
  }
};
</script>

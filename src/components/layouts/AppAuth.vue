<template>
  <v-container id="auth-layout" fluid tag="section">
    <app-material-card icon="mdi-account" :title="title" class="mx-auto">
      <v-row class="px-5"> </v-row>
    </app-material-card>
  </v-container>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class AppAuth extends Vue {
  @Prop() private title!: string;
}
</script>

<style lang="css">
#auth-layout {
  max-width: 480px;
  min-width: 300px;
  margin-top: 10%;
}
</style>

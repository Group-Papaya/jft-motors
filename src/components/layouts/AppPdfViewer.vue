<template>
  <v-dialog v-model="dialog" v-if="dialog" max-width="900">
    <v-card>
      <v-card-title class="flex-row justify-space-between">
        <span>PDF View</span>
        <v-btn fab x-small color="red" @click="showDialog()">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div id="pdf"></div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppPdfViewer extends Vue {
  name = "AppPdfViewer";

  dialog = false;

  showDialog() {
    this.dialog = !this.dialog;
  }
}
</script>

<style scoped lang="scss">
#pdf {
  text-align: center;
}

#pdf canvas {
  border: 1px solid black;
  width: 95%;
}
</style>

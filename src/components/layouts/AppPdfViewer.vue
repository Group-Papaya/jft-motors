<template>
  <v-dialog v-model="dialog" v-if="dialog" max-width="900">
    <v-card>
      <v-card-title>Add Line Item to Quotation</v-card-title>
      <v-card-text>
        <div id="pdf"></div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AppPdfViewer",
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    showDialog() {
      this.dialog = !this.dialog;
    }
  }
};
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

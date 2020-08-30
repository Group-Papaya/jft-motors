<template>
  <v-dialog v-model="dialog" max-width="290">
    <v-card>
      <v-card-title class="headline">{{ headline }}</v-card-title>

      <v-card-text>
        {{ message }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="closeDialog(true)">
          Yes
        </v-btn>

        <v-btn color="red darken-1" text @click="closeDialog(false)">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class AppConfirmDialog extends Vue {
  name = "AppConfirmDialog";
  dialog = false;
  message = "Message";
  headline = "Headline";
  confirmation = false;
  closeFunction?: (result: boolean) => void = undefined;

  showDialog(
    headline: string,
    message: string,
    onClose: (result: boolean) => void
  ) {
    this.message = message;
    this.headline = headline;
    this.closeFunction = onClose;
    this.dialog = true;
  }

  closeDialog(result: boolean) {
    if (this.closeFunction) this.closeFunction(result);
    this.dialog = false;
  }
}
</script>

<style scoped></style>

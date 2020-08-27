<template>
  <v-dialog v-model="dialog" max-width="290">
    <v-card>
      <v-card-title class="headline">Delete {{ itemName }}</v-card-title>

      <v-card-text>
        Are you sure you would like to delete {{ itemName }}?
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="closeDialog(false)">
          No
        </v-btn>

        <v-btn color="red darken-1" text @click="closeDialog(true)">
          Yes
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
  confirmation = false;

  @Prop({ type: String, default: undefined }) readonly itemName:
    | string
    | undefined;

  showDialog() {
    this.dialog = true;
  }

  closeDialog(result: boolean) {
    this.e;
  }
}
</script>

<style scoped></style>

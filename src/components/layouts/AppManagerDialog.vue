<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title>
        <span class="headline"
          >{{ create ? "Add" : "Edit" }} {{ headline }}</span
        >
      </v-card-title>
      <v-card-text>
        <v-form ref="baseForm" v-model="valid" lazy-validation>
          <v-form-base
            :col="12"
            :schema="schema"
            :row="attributes"
            :model="create ? model : item"
            @watch="watchHandler"
            @update="updateHandler"
            @change="changeHandler"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="validate()">
          Submit
        </v-btn>
        <v-btn color="error" @click="cancel()">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
// noinspection TypeScriptCheckImport
import VFormBase from "vuetify-form-base";

import { Component, Prop, Vue } from "vue-property-decorator";
import { LineItem } from "@/models";

@Component({
  components: { VFormBase }
})
export default class AppManagerDialog extends Vue {
  @Prop({
    type: String,
    default: "item"
  })
  readonly headline;

  @Prop({
    type: Object,
    default: undefined
  })
  readonly model;

  @Prop({
    type: Object,
    default: undefined
  })
  schema;

  @Prop({
    type: Function,
    default: () => undefined
  })
  addHandler;

  @Prop({
    type: Function,
    default: () => undefined
  })
  editHandler;

  @Prop({
    type: Function,
    default: () => undefined
  })
  onShowDialog;

  @Prop({
    type: Function,
    default: () => undefined
  })
  changeHandler;

  @Prop({
    type: Function,
    default: () => undefined
  })
  updateHandler;

  @Prop({
    type: Function,
    default: () => undefined
  })
  watchHandler;

  mounted() {
    this.valid = false;
  }

  get disabled() {
    return !this.valid;
  }

  item? = {};

  valid = false;
  dialog = false;
  create = false;
  attributes = {
    justify: "center",
    align: "center",
    noGutters: true
  };

  showDialog(create, item?: LineItem) {
    this.item = { ...item };
    this.create = create;
    this.onShowDialog({ ...item });
    this.dialog = true;
  }

  resetDialog() {
    this.form.resetValidation();
    this.form.reset();
    this.dialog = false;
  }

  handleInput(item) {
    if (this.create) {
      this.addHandler({ ...item });
    } else {
      this.editHandler({ ...item });
    }
    this.resetDialog();
  }

  cancel() {
    this.resetDialog();
  }

  validate() {
    if (this.form.validate()) {
      this.handleInput(this.create ? this.model : this.item);
    }
  }

  get form() {
    return this.$refs.baseForm as VFormBase;
  }
}
</script>

<style scoped></style>

<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title v-if="add">Add Line Item to Quotation</v-card-title>
      <v-card-title v-else>Update Line Item on Quotation</v-card-title>

      <v-card-text>
        <v-form ref="addLineItemForm" v-model="valid" lazy-validation>
          <v-autocomplete
            v-if="add"
            label="Line item"
            :model="item"
            :items="items"
            :item-text="value => value.name"
            :item-value="value => items.find(it => it.id === value.id)"
            @change="value => (item = value)"
            :rules="rules.item"
          />

          <v-text-field
            v-else
            disabled
            label="Line item"
            :value="item.name"
          ></v-text-field>

          <v-text-field
            v-if="item.cost && item.cost > 0"
            disabled
            :value="item.cost"
            label="Cost"
            prefix="R"
            type="number"
          ></v-text-field>

          <v-text-field
            v-if="item.cost"
            v-model="item.quantity"
            label="Quantity"
            type="number"
            :rules="rules.quantity"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-center align-center">
        <v-btn color="warning" @click="validate(item)">
          {{ add ? "Add" : "Update" }} Line Item
        </v-btn>
        <v-btn color="error" @click="cancel()">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
// noinspection TypeScriptCheckImport
import VFormBase from "vuetify-form-base";

import { Component, Vue, Prop } from "vue-property-decorator";
import { nonZero, required } from "@/utils";

@Component({
  components: {
    VFormBase
  }
})
export default class AppAddLineItemToQuotation extends Vue {
  @Prop({
    type: Object,
    default: undefined
  })
  readonly quotation;

  @Prop({
    type: Function,
    default: () => undefined
  })
  readonly addHandler;

  @Prop({
    type: Function,
    default: () => undefined
  })
  readonly editHandler;

  valid = false;
  add = false;
  dialog = false;

  schema = {
    quantity: {
      value: 0,
      type: "number",
      required: true,
      label: "Quantity"
    },
    cost: {
      value: 0,
      type: "number",
      label: "Cost",
      prefix: "R",
      readonly: true
    },
    discount: {
      inset: true,
      value: false,
      hidden: true,
      type: "switch",
      disabled: false,
      label: "Apply discount"
    }
  };

  attributes = {
    justify: "center",
    align: "center",
    noGutters: true
  };

  item = {};

  rules = {
    item: [required("Item is required")],
    quantity: [required("Quanity is required"), nonZero()]
  };

  showDialog(add, item) {
    this.add = add;
    this.dialog = true;
    if (item) this.item = { ...item };
  }

  handleInput(value) {
    if (this.add) this.addHandler({ ...value });
    else this.editHandler({ ...value });
    this.resetDialog();
  }
  resetDialog() {
    this.form.resetValidation();
    this.form.reset();
    this.item = {};
    this.dialog = false;
  }

  cancel() {
    this.resetDialog();
  }

  validate(item) {
    if (this.form.validate()) {
      this.handleInput({ ...item });
    }
  }

  get form() {
    return this.$refs.addLineItemForm as VFormBase;
  }

  // filter items that are already on quotation so that user cannot add the same line item more than
  get items() {
    return this.$store.state.records.lineitems.filter(
      item => !this.quotation.items.find(_item => item.id === _item.id)
    );
  }

  // update({ schema }) {
  //   schema.discount.value = this.item.discounted;
  //   schema.discount.hidden = !this.item.discounted;
  //   schema.discount.disabled = !this.$store.getters.discounts.allowed;
  // }
}
</script>

<style scoped></style>

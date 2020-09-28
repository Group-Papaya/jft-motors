<template>
  <v-dialog v-model="dialog" v-if="dialog" max-width="600">
    <v-card>
      <v-card-title>Add Line Item to Quotation</v-card-title>
      <v-card-text>
        <v-form>
          <v-autocomplete
            label="Line item"
            :model="item"
            :items="items"
            :item-text="value => value.name"
            :item-value="value => items.find(it => it.id === value.id)"
            @change="value => (item = value)"
          />
          <v-form-base
            :col="12"
            :model="item"
            :schema="schema"
            :row="attributes"
            @update="update"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-center align-center">
        <v-btn color="warning" @click="handleInput(item)">
          {{ add ? "Add" : "Update" }} Line Item
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import VFormBase from "../../../node_modules/vuetify-form-base/dist/src/vFormBase.vue";
import { Component, Vue, Prop } from "vue-property-decorator";

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

  add = false;
  dialog = false;
  items = this.$store.state.records.lineitems;
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
      readonly: true
    },
    discount: {
      value: false,
      type: "switch",
      label: "Apply discount",
      hidden: true
    }
  };

  attributes = {
    justify: "center",
    align: "center",
    noGutters: true
  };

  item = {
    id: "",
    cost: 0,
    name: "",
    type: "",
    path: "",
    units: 0,
    quantity: 0,
    details: "",
    discounted: false
  };

  showDialog(add, item) {
    this.add = add;
    this.dialog = true;
    if (item) this.item = item;
  }

  handleInput(value) {
    if (this.add) this.addHandler(value);
    else this.editHandler(value);
    this.dialog = false;
  }

  update({ schema }) {
    schema.discount.value = this.item.discounted;
    schema.discount.hidden = !this.item.discounted;
  }
}
</script>

<style scoped></style>

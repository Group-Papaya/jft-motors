<template>
  <AppEditor
    title="LineItems"
    :items="items"
    :model="model"
    :schema="schema"
    :headers="headers"
    :editHandler="editItem"
    :addHandler="addLineItem"
    :watch-handler="watchEvent"
    :on-show-dialog="setDialog"
    :change-handler="handleChange"
    icon="mdi-format-list-bulleted"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppEditor from "@/components/layouts/AppManager.vue";
import LineItem, { ITEMISES } from "@/models/LineItem";
import { Discount } from "@/models";

@Component({
  components: { AppEditor }
})
export default class LineItems extends Vue {
  headers = [
    {
      sortable: false,
      text: "ID",
      value: "id"
    },
    {
      sortable: false,
      text: "Name",
      value: "name"
    },
    {
      sortable: false,
      text: "Type",
      value: "type"
    },
    {
      sortable: false,
      text: "Cost",
      value: "format"
    },
    {
      sortable: false,
      text: "Units",
      value: "units"
    },
    {
      sortable: false,
      text: "Discount",
      value: "meta.discount.format"
    },
    {
      sortable: false,
      text: "Discounted",
      value: "discounted"
    },
    {
      sortable: false,
      value: "actions"
    }
  ];

  get items() {
    return this.$store.state.records.lineitems;
  }

  model: LineItem = {
    type: "",
    name: "",
    cost: 0,
    units: 0,
    unit: "",
    format: "",
    details: "",
    quantity: 0,
    discount: "",
    discounted: false
  };

  schema = {
    name: {
      type: "text",
      label: "Line item name"
    },
    details: {
      type: "text",
      label: "Line Details"
    },
    type: {
      type: "select",
      label: "Type",
      items: ITEMISES
    },
    cost: {
      type: "number",
      label: "Cost"
    },
    units: {
      type: "number",
      label: "Units"
    },
    discounted: {
      inset: true,
      type: "switch",
      label: "Discountable?",
      value: this.model.discounted
    },
    discount: {
      type: "autocomplete",
      label: "Select Discount",
      disabled: this.model.discounted,
      items: this.$store.state.records.discounts,
      itemText: (value: Discount) => value.name,
      itemValue: (value: Discount) => value
    }
  };

  setDialog(item: LineItem) {
    this.schema.discount.disabled = !item?.discounted;
  }

  handleChange({ key, value }: any) {
    if (key === "discounted") {
      this.model.discounted = value !== null;
      this.schema.discounted.value = value !== null;
      this.schema.discount.disabled = value === null;
    }
    if (key === "discount") this.mutModelState(value);
  }

  watchEvent({ on, key, value }: any) {
    if (on === "input") {
      if (key === "discount") this.mutModelState(value);
    }
  }

  mutModelState(value: Discount) {
    this.model.discount = `R${this.calculateDiscountFor(this.model, value)}`;
  }

  editItem(record: LineItem) {
    this.$store.dispatch("SET_RECORD", {
      record: this.setDiscount(record),
      path: record.path
    });
  }

  addLineItem(record: LineItem) {
    this.$store.dispatch("ADD_RECORD", {
      record: this.setDiscount(record),
      path: "line-items"
    });
  }

  calculateDiscountFor(item, discount) {
    return discount.percentage
      ? item.cost * (discount.amount * (1 / 100))
      : item.cost - discount.amount;
  }

  setDiscount({ discounted, ...item }: LineItem): LineItem {
    const discount = item.cost - this.calculateDiscountFor(item, item.discount);
    return {
      ...item,
      discounted: discounted,
      format: `R${item.cost}`,
      discount: `R${discount}`,
      meta: {
        ...item.meta,
        discount: {
          value: discount,
          ...item.discount
        }
      }
    };
  }
}
</script>

<style scoped></style>

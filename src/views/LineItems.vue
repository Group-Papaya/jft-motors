<template>
  <AppEditor
    title="LineItems"
    :items="items"
    :model="item"
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
import LineItem, { ITEMISES, TYPE_ICONS } from "@/models/LineItem";
import { Discount } from "@/models";
import { required, nonZero } from "@/utils";

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
      value: "meta.units"
    },
    {
      sortable: false,
      text: "Discount",
      value: "discount"
    },
    {
      sortable: false,
      text: "Discounted",
      value: "meta.discounted"
    },
    {
      sortable: false,
      value: "actions"
    }
  ];

  get items() {
    return this.$store.state.records.lineitems;
  }

  item: LineItem = {
    type: "",
    name: "",
    cost: 0,
    units: 0,
    format: "",
    details: "",
    quantity: 0,
    discount: "",
    discounted: false
  };

  schema = {
    name: {
      type: "text",
      label: "Line item name",
      rules: [required("Line item name is required")]
    },
    details: {
      type: "text",
      label: "Line Details"
    },
    type: {
      label: "Type",
      type: "select",
      items: ITEMISES,
      rules: [required("Type is required")]
    },
    cost: {
      min: 0,
      label: "Cost",
      type: "number",
      prependIcon: "R",
      rules: [required("Cost is required"), nonZero()]
    },
    units: {
      label: "Units",
      type: "number"
    },
    discounted: {
      inset: true,
      type: "switch",
      label: "Discountable?",
      value: this.item.discounted
    },
    discount: {
      type: "autocomplete",
      appendIcon: undefined,
      label: "Select Discount",
      disabled: this.item.discounted,
      items: this.$store.state.records.discounts,
      itemText: (value: Discount) => value.name,
      itemValue: (value: Discount) => value
    }
  };

  setDialog(item: LineItem) {
    this.schema.discount.disabled = !item?.discounted;
  }

  handleChange({ key, value, data: { name } }: any) {
    if (!name) return;

    if (key === "discounted") {
      this.item.discounted = value !== null;
      this.schema.discounted.value = value !== null;
      this.schema.discount.disabled = value === null;
    }
    if (key === "discount") this.mutModelState(value);
  }

  watchEvent({ on, key, value }: any) {
    if (!value) return;

    if (on === "input") {
      if (key === "discount") this.mutModelState(value);
    }
  }

  mutModelState(value: Discount) {
    this.item.discount = `R${this.getDiscountFor(this.item, value)}`;
  }

  editItem(record: LineItem) {
    this.$store.dispatch("SET_RECORD", {
      record: this.setDiscount(record),
      path: record.path
    });
  }

  async addLineItem(record: LineItem) {
    await this.$store.dispatch("ADD_RECORD", {
      record: this.setDiscount(record),
      path: "line-items"
    });
    this.$toast.success("New Line item added");
  }

  getDiscountFor(item: LineItem, discount: Discount) {
    return discount.percentage
      ? item.cost * (discount.amount * (1 / 100))
      : discount.amount;
  }

  setDiscount(item: LineItem): LineItem {
    const discount = this.getDiscountFor(item, item.discount as Discount);
    // const unit = item.type === WORKER ? "hours" : "";
    return {
      ...item,
      format: `R${item.cost}`,
      discounted: item.discounted,
      discount: `R${discount ? discount : "0"}`,
      meta: {
        ...item.meta,
        discounted: item.discounted ? "✅" : "❌",
        units: TYPE_ICONS[item.type] + ` x ${item.units}`,
        discount: {
          value: discount ? discount : 0,
          ...(item.discount as Discount)
        }
      }
    };
  }
}
</script>

<style scoped></style>

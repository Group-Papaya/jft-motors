<template>
  <AppEditor
    title="Discounts"
    :items="items"
    :model="model"
    :schema="schema"
    :headers="headers"
    :edit-handler="editItem"
    :add-handler="addDiscount"
    :change-handler="handleChanges"
    icon="mdi-tag-text-outline"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppEditor from "@/components/layouts/AppManager.vue";
import { Discount } from "@/models";

@Component({
  components: { AppEditor }
})
export default class Discounts extends Vue {
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
      text: "Amount",
      value: "format"
    },
    {
      sortable: false,
      text: "Description",
      value: "details"
    },
    {
      sortable: false,
      value: "actions"
    }
  ];

  discounts = this.$store.getters.discounts;

  get items() {
    return this.$store.state.records.discounts;
  }

  get rules() {
    return {
      ispercentage: (it: any) =>
        it ? this.discounts.percentage : this.discounts.rands
    };
  }

  model: Discount = {
    name: "",
    amount: 0,
    format: "",
    details: "",
    percentage: false
  };

  schema = {
    name: {
      type: "text",
      label: "Discount name"
    },
    details: {
      type: "text",
      label: "Discount description"
    },
    amount: {
      min: 0,
      step: 0.25,
      type: "number",
      label: "Amount",
      max: this.rules.ispercentage(this.model.percentage)
    },
    percentage: {
      inset: true,
      value: false,
      type: "switch",
      label: "Percentage Discount"
    }
  };

  handleChanges({ key, value }: any) {
    if (key === "amount") {
      this.schema.amount.max = this.rules.ispercentage(
        this.schema.percentage.value
      );
    }
    if (key === "percentage") {
      this.schema.amount.max = this.rules.ispercentage(value);
    }
  }

  editItem(record: Discount) {
    this.$store.dispatch("SET_RECORD", {
      record: this.discount(record),
      path: record.path
    });
  }

  addDiscount(record: Discount) {
    this.$store.dispatch("ADD_RECORD", {
      record: this.discount(record),
      path: "discounts"
    });
  }

  discount({ percentage, ...discount }: Discount): Discount {
    percentage = percentage || false;
    const symbol = percentage ? "%" : "R";
    const max = this.rules.ispercentage(percentage);
    const amount = discount.amount < max ? discount.amount : max;
    return {
      ...discount,
      amount: amount,
      format: percentage ? `${amount}${symbol}` : `${symbol}${amount}`,
      percentage: percentage
    };
  }
}
</script>

<style scoped></style>

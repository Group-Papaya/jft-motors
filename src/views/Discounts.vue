<template>
  <AppEditor
    title="Discounts"
    :model="model"
    :schema="schema"
    :change-handler="handleChanges"
    :editHandler="editItem"
    :addHandler="addDiscount"
    icon="mdi-tag-text-outline"
    :items="items"
    :headers="headers"
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
      text: "Percentage",
      value: "percentage"
    },
    {
      sortable: false,
      text: "Details",
      value: "details"
    },
    {
      sortable: false,
      value: "actions"
    }
  ];

  get items() {
    return this.$store.state.records.discounts;
  }

  get rules() {
    return {
      ispercentage: it => (it ? 15 : 150)
    };
  }

  model: Discount = {
    name: "",
    amount: 0,
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
      label: "Discount details"
    },
    amount: {
      min: 0,
      step: 0.25,
      type: "number",
      label: "Amount"
    },
    percentage: {
      inset: true,
      type: "switch",
      label: "Percentage Discount",
      value: false
    }
  };

  handleChanges({ key, value }) {
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

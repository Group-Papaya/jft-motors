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
import { required } from "@/utils";

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
      label: "Discount name",
      rules: [required("Discount name is required")]
    },
    details: {
      type: "text",
      label: "Discount description",
      rules: [required("Description name is required")]
    },
    amount: {
      min: 0,
      step: 0.25,
      type: "number",
      label: "Amount",
      max: this.rules.ispercentage(this.model.percentage),
      rules: [required("Amount is required")]
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

    this.$toast.success(`Discount "${record.name}" updated`);
  }

  async addDiscount(record: Discount) {
    await this.$store.dispatch("ADD_RECORD", {
      record: this.discount(record),
      path: "discounts"
    });
    this.$toast.success("New discount added");
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

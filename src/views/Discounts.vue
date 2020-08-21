<template>
  <AppEditor
    title="Discounts"
    :model="model"
    :schema="schema"
    :addHandler="addDiscount"
    :editHandler="editItem"
    icon="mdi-tag-text-outline"
    :items="items"
    :headers="headers"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { JOB, PRODUCT, WORKER } from "@/models/LineItem";
import AppEditor from "@/components/layouts/AppEditor.vue";
import Discount from "@/models/Discount";

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
      text: "name",
      value: "name"
    },
    {
      sortable: false,
      text: "amount",
      value: "amount"
    },
    {
      sortable: false,
      text: "percentage",
      value: "percentage"
    },
    {
      sortable: false,
      text: "actions",
      value: "actions"
    }
  ];

  items: any[] = [];

  model = {
    name: "",
    amount: 0,
    percentage: 0
  };

  schema = {
    name: {
      type: "text",
      label: "Discount name"
    },
    amount: {
      type: "number",
      label: "Amount"
    },
    percentage: {
      type: "number",
      label: "Percentage"
    }
  };

  mounted() {
    this.getDemoData();
  }

  getDemoData() {
    for (let x = 1; x < 11; x++) {
      const lineItem = {
        id: `${x}`,
        name: `discount ${x}`,
        amount: x * Math.random(),
        percentage: x * 1000
      };

      this.items.push(lineItem);
    }
  }

  editItem(discount: Discount) {
    console.log(discount);
  }

  addDiscount(discount: Discount) {
    console.log(discount);
  }
}
</script>

<style scoped></style>

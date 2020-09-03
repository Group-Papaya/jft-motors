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
import AppEditor from "@/components/layouts/AppManager.vue";
import Discount from "@/models/Discount";
import { watchCollection } from "@/services/curd.service";

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
      value: "amount"
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
      type: "number",
      label: "Amount"
    },
    percentage: {
      inset: true,
      type: "switch",
      label: "Percentage",
      value: this.model.percentage
    }
  };

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

  discount({ percentage, ...rest }: Discount) {
    return {
      ...rest,
      percentage: percentage || false
    };
  }
}
</script>

<style scoped></style>

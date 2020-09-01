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

  get items() {
    return this.$store.state.records.discounts;
  }

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

  editItem(record: Discount) {
    this.$store.dispatch("SET_RECORD", { record, path: record.path });
  }

  addDiscount(record: Discount) {
    this.$store.dispatch("ADD_RECORD", { record, path: "discounts" });
  }
}
</script>

<style scoped></style>

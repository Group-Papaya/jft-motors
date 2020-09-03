<template>
  <AppEditor
    title="LineItems"
    :model="model"
    :schema="schema"
    :addHandler="addLineItem"
    :editHandler="editItem"
    icon="mdi-format-list-bulleted"
    :items="items"
    :headers="headers"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppEditor from "@/components/layouts/AppManager.vue";
import LineItem, { JOB, PRODUCT, WORKER } from "@/models/LineItem";
import { watchCollection } from "@/services/curd.service";
import { Discount } from "@/models";
import { db } from "@/firebase";
import { dbService } from "@/services/firestore.service";

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
      value: "cost"
    },
    {
      sortable: false,
      text: "Units",
      value: "units"
    },
    {
      sortable: false,
      text: "Discount",
      value: "discount"
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
    name: "",
    type: "",
    cost: 0,
    units: 0,
    details: "",
    quantity: 0,
    discount: "",
    discounted: false
  };

  disabled = true;

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
      items: [JOB, WORKER, PRODUCT]
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
      disabled: this.model.discounted,
      label: "Select Discount",
      items: this.$store.state.records.discounts,
      itemText: (value: Discount) => value.name,
      itemValue: (value: Discount) => value.path
    }
  };

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

  setDiscount({ discounted, ...rest }: LineItem) {
    return {
      ...rest,
      discount: discounted ? rest.discount : ""
    };
  }
}
</script>

<style scoped></style>

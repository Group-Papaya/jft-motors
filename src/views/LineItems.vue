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
      text: "name",
      value: "name"
    },
    {
      sortable: false,
      text: "type",
      value: "type"
    },
    {
      sortable: false,
      text: "cost",
      value: "cost"
    },
    {
      sortable: false,
      text: "units",
      value: "units"
    },
    {
      sortable: false,
      text: "discount",
      value: "discounted"
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
    type: "",
    cost: 0,
    units: 0
  };

  schema = {
    name: {
      type: "text",
      label: "Line item name"
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
    }
  };

  mounted() {
    this.getDemoData();
  }



  getDemoData() {
    for (let x = 1; x < 11; x++) {
      const lineItem = {
        id: `${x}`,
        name: `line item-${x}`,
        type: x % 2 ? WORKER : PRODUCT,
        cost: x * 2 * Math.random(),
        units: x * 1000,
        discounted: false
      };

      this.items.push(lineItem);
    }
  }

  editItem(lineItem: LineItem) {
    console.log(lineItem);
  }

  addLineItem(lineItem: LineItem) {
    console.log(lineItem);
  }
}
</script>

<style scoped></style>

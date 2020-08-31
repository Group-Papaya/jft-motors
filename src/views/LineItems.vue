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

  get items() {
    return this.$store.state.records.lineitems;
  }

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

  created() {
    watchCollection("line-items", data =>
      this.$store.commit("SET_RECORDS", { lineitems: data })
    );
  }

  editItem(record: LineItem) {
    this.$store.dispatch("SET_RECORD", { record, path: record.path });
  }

  addLineItem(record: LineItem) {
    this.$store.dispatch("ADD_RECORD", { record, path: "line-items" });
  }
}
</script>

<style scoped></style>

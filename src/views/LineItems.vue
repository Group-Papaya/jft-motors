<template>
  <v-container id="invoices" fluid tag="section" class="my-5">
    <app-material-card
      color="warning"
      icon="mdi-format-list-bulleted"
      title="Line Items"
      class="px-5 py-3"
    >
      <!--           line items list -->
      <v-data-table :headers="headers" :items="items">
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </app-material-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
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

  mounted() {
    this.getDemoData();
  }

  getDemoData() {
    for (let x = 1; x < 11; x++) {
      const lineItem = {
        id: `${x}`,
        name: `line item-${x}`,
        type: `client ${x}`,
        cost: x * Math.random(),
        units: x * 1000,
        discounted: false
      };

      this.items.push(lineItem);
    }
  }

  editItem(id: string) {
    console.log(id);
  }

  deleteItem(id: string) {
    console.log(id);
  }
}
</script>

<style scoped></style>

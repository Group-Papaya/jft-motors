<template>
  <v-container id="invoices" fluid tag="section" class="my-5">
    <app-material-card
      color="warning"
      icon="mdi-tag-text-outline"
      title="Discounts"
      class="px-5 py-3"
    >
      <!--           discount list -->
      <v-data-table :headers="headers" :items="items">
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small color="red" @click="deleteItem(item)">
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

  editItem(id: string) {
    console.log(id);
  }

  deleteItem(id: string) {
    console.log(id);
  }
}
</script>

<style scoped></style>

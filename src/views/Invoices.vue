<template>
  <v-container id="invoices" fluid tag="section" class="my-5">
    <app-material-card
      color="success"
      icon="mdi-note-text"
      title="Invoices"
      class="px-5 py-3"
    >
      <!--           invoice list -->
      <v-data-table :headers="headers" :items="items"> </v-data-table>
    </app-material-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";

@Component
export default class Invoices extends Vue {
  headers = [
    {
      sortable: false,
      text: "ID",
      value: "id"
    },
    {
      sortable: false,
      text: "client",
      value: "client"
    },
    {
      sortable: false,
      text: "date",
      value: "created"
    },
    {
      sortable: false,
      text: "total",
      value: "total"
    }
  ];

  items: any[] = [];

  mounted() {
    this.getDemoData();
  }

  getDemoData() {
    for (let x = 1; x < 11; x++) {
      const quotation = {
        id: `${x}`,
        client: `client ${x}`,
        created: moment().format("MMMM Do YYYY"),
        total: x * 1000
      };

      this.items.push(quotation);
    }
  }
}
</script>

<style scoped></style>

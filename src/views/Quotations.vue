<template>
  <v-container id="quotations" fluid tag="section" class="my-5">
    <app-material-card
      color="warning"
      icon="mdi-note"
      title="Quotations"
      class="px-5 py-3"
    >
      <template v-slot:after-heading>
        <div class="ml-auto text-right">
          <v-btn fab top right small color="warning">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <span class="body-3 ml-2 hidden-sm-and-down text-subtitle-2"
            >Add Quotation</span
          >
        </div>
      </template>

      <!--           quotation list -->
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
import moment from "moment";

@Component
export default class Quotations extends Vue {
  title = "Quotations are not what I means";
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
      text: "modified",
      value: "updated"
    },
    {
      sortable: false,
      text: "total",
      value: "total"
    },
    {
      sortable: false,
      text: "Actions",
      value: "actions"
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
        updated: moment().format("MMMM Do YYYY"),
        total: x * 1000
      };

      this.items.push(quotation);
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

<style scoped lang="scss"></style>

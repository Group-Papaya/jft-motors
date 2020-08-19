<template>
  <v-container id="invoices" fluid tag="section" class="my-5">
    <app-material-card
      color="warning"
      icon="mdi-account-box-outline"
      title="Clients"
      class="px-5 py-3"
    >
      <!--           client list -->
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
export default class Clients extends Vue {
  headers = [
    {
      sortable: false,
      text: "ID",
      value: "id"
    },
    {
      sortable: false,
      text: "first name",
      value: "firstname"
    },
    {
      sortable: false,
      text: "last name",
      value: "lastname"
    },
    {
      sortable: false,
      text: "phone number",
      value: "phone"
    },
    {
      sortable: false,
      text: "email address",
      value: "email"
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
      const client = {
        id: `${x}`,
        firstname: `client ${x}`,
        lastname: moment().format("MMMM Do YYYY"),
        phone: x * 1000,
        email: "test@email.com"
      };

      this.items.push(client);
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

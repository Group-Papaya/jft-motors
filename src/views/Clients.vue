<template>
  <AppEditor
    title="Clients"
    :model="model"
    :schema="schema"
    :addHandler="addClient"
    :editHandler="editItem"
    icon="mdi-account-box-outline"
    :items="items"
    :headers="headers"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppEditor from "@/components/layouts/AppManager.vue";
import Client from "@/models/Client";

@Component({
  components: { AppEditor }
})
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

  model = {
    fistname: "",
    lastname: "",
    phone: "",
    email: ""
  };

  schema = {
    firstname: {
      type: "text",
      label: "First Name"
    },
    lastname: {
      type: "text",
      label: "Last Name"
    },
    phone: {
      type: "text",
      label: "Phone Number"
    },
    email: {
      type: "email",
      label: "Email Address"
    }
  };

  mounted() {
    this.getDemoData();
  }

  getDemoData() {
    for (let x = 1; x < 11; x++) {
      const client = {
        id: `${x}`,
        firstname: `client ${x}`,
        lastname: "test" + x,
        phone: x * 1000,
        email: "test@email.com"
      };

      this.items.push(client);
    }
  }

  editItem(client: Client) {
    console.log(client);
  }

  addClient(client: Client) {
    console.log(client);
  }
}
</script>

<style scoped></style>

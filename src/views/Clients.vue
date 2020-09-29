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
import { watchCollection } from "@/services/curd.service";
import { emailVal, required } from "@/utils";

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
      text: "Firstname",
      value: "firstname"
    },
    {
      sortable: false,
      text: "Lastname",
      value: "lastname"
    },
    {
      sortable: false,
      text: "Phone Number",
      value: "phone"
    },
    {
      sortable: false,
      text: "E-mail Address",
      value: "email"
    },
    {
      sortable: false,
      value: "actions"
    }
  ];

  get items() {
    return this.$store.state.records.clients;
  }

  model = {
    firstname: "",
    lastname: "",
    phone: "",
    email: ""
  };

  schema = {
    firstname: {
      type: "text",
      label: "First Name",
      rules: [required("First name is required")]
    },
    lastname: {
      type: "text",
      label: "Last Name",
      rules: [required("Last Name is required")]
    },
    phone: {
      type: "text",
      label: "Phone Number",
      rules: [required("Phone number is required")]
    },
    email: {
      type: "email",
      label: "E-mail Address",
      rules: [required("Email address is required"), emailVal()]
    }
  };

  async editItem(record: Client) {
    await this.$store.dispatch("SET_RECORD", { record, path: record.path });
    this.$toast.success(
      `Client "${record.firstname} ${record.lastname}" updated`
    );
  }

  addClient(record: Client) {
    this.$store.dispatch("ADD_RECORD", { record, path: "clients" });
    this.$toast.success("New client added");
  }
}
</script>

<style scoped></style>

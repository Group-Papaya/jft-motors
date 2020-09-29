<template>
  <AppManager
    title="Quotations"
    icon="mdi-note"
    :model="model"
    :schema="schema"
    :headers="headers"
    :items="this.items"
    :add-handler="addQuotation"
    :change-handler="handleChanges"
    :on-delete-dialog="deleteQuotation"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppManager from "@/components/layouts/AppManager.vue";
import Quotation from "@/models/Quotation";
import { curd } from "@/services/curd.service";
import { Client } from "@/models";
import { required } from "@/utils";

@Component({
  components: { AppManager }
})
export default class Quotations extends Vue {
  headers = [
    {
      sortable: false,
      text: "ID",
      value: "id"
    },
    {
      sortable: false,
      text: "Client",
      value: "client"
    },
    {
      sortable: false,
      text: "Date Created",
      value: "created"
    },
    {
      sortable: false,
      text: "Modified",
      value: "updated"
    },
    {
      sortable: false,
      text: "Total",
      value: "format"
    },
    {
      sortable: false,
      text: "Actions",
      value: "actions"
    }
  ];

  model = {
    client: "",
    meta: {
      client: Client
    }
  };

  schema = {
    client: {
      type: "autocomplete",
      label: "Select Client",
      items: this.clients,
      itemText: (value: Client) => `${value.firstname} ${value.lastname}`,
      itemValue: (value: Client) => value,
      rules: [required("Client is required")]
    }
  };

  async handleChanges({ _, value }: any) {
    this.model.meta.client = value;
  }

  get items() {
    return this.$store.state.records.quotations;
  }

  get clients() {
    return this.$store.state.records.clients;
  }

  deleteQuotation(result: boolean, quotation: Quotation) {
    if (result)
      curd
        .deleteCollection(`${quotation.path}/items`)
        .then(() => curd.delete(quotation.path as string));
  }

  async addQuotation(quotation: Quotation) {
    await this.$store.dispatch("ADD_QUOTATION", quotation);
    this.$toast.success("New quotation added");
  }
}
</script>

<style scoped lang="scss"></style>

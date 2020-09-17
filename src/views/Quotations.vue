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
import moment from "moment";
import { Component, Vue } from "vue-property-decorator";
import AppManager from "@/components/layouts/AppManager.vue";
import Quotation from "@/models/Quotation";
import { curd } from "@/services/curd.service";
import { Client } from "@/models";

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
      itemValue: (value: Client) => value
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

  addQuotation(record: Quotation) {
    const client = record.meta.client;
    const user = this.$store.state.auth.user;
    this.$store.dispatch("ADD_RECORD", {
      record: {
        ...record,
        items: [],
        total: 0.0,
        format: "R0.0",
        completed: false,
        user: `${user.firstname} ${user.lastname}`,
        client: `${client.firstname} ${client.lastname}`,
        created: moment().format("MMMM Do YYYY"),
        updated: moment().format("MMMM Do YYYY"),
        meta: {
          ...record.meta,
          user: user
        }
      },
      path: "quotations"
    });
  }
}
</script>

<style scoped lang="scss"></style>

<template>
  <AppManager
    title="Quotations"
    :model="model"
    :schema="schema"
    :addHandler="addQuotation"
    icon="mdi-note"
    :changeHandler="handleChanges"
    :items="this.items"
    :headers="headers"
  />
</template>

<script lang="ts">
import moment from "moment";
import { Component, Vue } from "vue-property-decorator";
import AppManager from "@/components/layouts/AppManager.vue";
import Quotation from "@/models/Quotation";
import { curd, watchCollection } from "@/services/curd.service";
import { auth } from "firebase";
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
      value: "total"
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

  async handleChanges({ key, value }: any) {
    this.model.meta.client = value;
  }

  get items() {
    return this.$store.state.records.quotations;
  }

  get clients() {
    return this.$store.state.records.clients;
  }

  addQuotation(record: Quotation) {
    const client = record.meta.client;
    const user = this.$store.state.auth.user;
    this.$store.dispatch("ADD_RECORD", {
      record: {
        ...record,
        items: [],
        total: 0.0,
        client: `${client.firstname} ${client.lastname}`,
        completed: false,
        user: `${user.firstname} ${user.lastname}`,
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

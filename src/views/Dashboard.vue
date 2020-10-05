<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12" md="6">
        <!-- quotation list -->
        <AppManager
          title="Quotations"
          :subtitle="'Quotations ' + subtitle"
          :model="model"
          :schema="schema"
          :addHandler="addQuotation"
          :items="this.drafts"
          :headers="headers"
        />
      </v-col>

      <v-col cols="12" md="6">
        <!-- invoice list: App Manager component -->
        <AppManager
          title="Invoices"
          :subtitle="'Invoices ' + subtitle"
          :model="model"
          :schema="schema"
          :addHandler="addQuotation"
          :items="this.invoices"
          :button="false"
          color="primary"
          :headers="headers"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
// import Modules
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";
import Quotation from "@/models/Quotation";
import AppManager from "@/components/layouts/AppManager.vue";
import { Client } from "@/models";
import { required } from "@/utils";

// declare Dashboard component with nested components components
@Component({
  components: { AppManager }
})
export default class Dashboard extends Vue {
  // list header configuration
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
      text: "Created",
      value: "created"
    },
    {
      sortable: false,
      text: "Total",
      value: "format"
    }
  ];

  // data model for add new quotation form
  model = {
    client: "",
    meta: {
      client: Client
    }
  };

  // schema for add new quotation form
  schema = {
    client: {
      type: "autocomplete",
      label: "Type to search for a client",
      items: this.clients,
      hint: "Select a client to start building a quotation",
      itemText: (value: Client) => `${value.firstname} ${value.lastname}`,
      itemValue: (value: Client) => value,
      rules: [required("Client is required")]
    }
  };

  /**
   * method to get a list of quotations that are not marked as complete
   */
  get drafts() {
    return this.$store.getters.drafts;
  }

  /**
   * method to get a list of quotations that are marked as complete
   */
  get invoices() {
    return this.$store.getters.invoices;
  }

  /**
   * method to get a list of all clients
   */
  get clients() {
    return this.$store.state.records.clients;
  }

  /**
   * method to save a new quotation firebase
   */
  async addQuotation(quotation: Quotation) {
    // add new quotation to store
    await this.$store.dispatch("ADD_QUOTATION", quotation);

    // show success notification
    this.$toast.success("New quotation added");
  }

  /**
   * GETTERS
   */
  get subtitle() {
    return `for month of ${moment().format("MMMM")}`;
  }
}
</script>

<style scoped lang="scss"></style>

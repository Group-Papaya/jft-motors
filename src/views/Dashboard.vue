<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12" md="6">
        <!-- quotation card -->
        <AppManager
          title="Quotations"
          :subtitle="'Quotations ' + subtitle"
          :model="model"
          :schema="schema"
          :changeHandler="handleChanges"
          :addHandler="addQuotation"
          :items="this.drafts"
          :headers="headers"
        />
      </v-col>

      <v-col cols="12" md="6">
        <!-- invoice card -->
        <AppManager
          title="Invoices"
          :subtitle="'Invoices ' + subtitle"
          :model="model"
          :schema="schema"
          :addHandler="addQuotation"
          :items="this.invoices"
          :changeHandler="handleChanges"
          :button="false"
          color="primary"
          :headers="headers"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";
import Quotation from "@/models/Quotation";
import AppManager from "@/components/layouts/AppManager.vue";
import { Client } from "@/models";

@Component({
  components: { AppManager }
})
export default class Dashboard extends Vue {
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

  get drafts() {
    return this.$store.getters.drafts;
  }

  get invoices() {
    return this.$store.getters.invoices;
  }

  get clients() {
    return this.$store.state.records.clients;
  }

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
    if (key === "client") this.model.meta.client = value;
  }

  addQuotation(quotation: Quotation) {
    if (typeof quotation.meta.client === "object") {
      this.$store.dispatch("ADD_QUOTATION", quotation);
    } else this.$toast.error("Remember to Select a Client");
  }

  get subtitle() {
    return `for month of ${moment().format("MMMM")}`;
  }
}
</script>

<style scoped lang="scss">
.hello {
  text-align: center;
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

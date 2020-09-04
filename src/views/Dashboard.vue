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
  // quotation table header
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
      text: "created",
      value: "created"
    },
    {
      sortable: false,
      text: "total",
      value: "total"
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
    client: ""
  };

  schema = {
    client: {
      type: "select",
      label: "Client",
      items: this.clients,
      itemText: (value: Client) => `${value.firstname} ${value.lastname}`
    }
  };

  // get current  month
  currentMonth = moment().format("MMMM");

  addQuotation(record: Quotation) {
    this.$store.dispatch("ADD_RECORD", {
      record: {
        ...record,
        items: [],
        total: 0.0,
        completed: false,
        user: this.$store.state.auth.user.uid,
        created: moment().format("MMMM Do YYYY"),
        updated: moment().format("MMMM Do YYYY")
      },
      path: "quotations"
    });
  }

  get subtitle() {
    return `for month of ${this.currentMonth}`;
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

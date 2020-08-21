<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row class="my-5">
      <v-col cols="12" md="6">
        <!-- quotation card -->
        <AppManager
          title="Quotations"
          :subtitle="'Quotations ' + subtitle"
          :model="model"
          :schema="schema"
          :addHandler="addQuotation"
          :items="items"
          :headers="headers"
        >
        </AppManager>
      </v-col>

      <v-col cols="12" md="6">
        <!-- invoice card -->
        <AppManager
          title="Invoices"
          :subtitle="'Invoices ' + subtitle"
          :model="model"
          :schema="schema"
          :addHandler="addQuotation"
          :items="items"
          :button="false"
          color="primary"
          :headers="headers"
        >
        </AppManager>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";
import Quotation from "@/models/Quotation";
import AppManager from "@/components/layouts/AppManager.vue";

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

  // invoice items
  items: any[] = [];

  model = {
    client: ""
  };

  schema = {
    client: {
      type: "select",
      label: "Client",
      items: ["Tesla", "Jobs", "Taleb"]
    }
  };

  // get current  month
  currentMonth = moment().format("MMMM");

  mounted() {
    this.getDemoData();
  }

  addQuotation(quotation: Quotation) {
    // write to firebase
    console.log(quotation);
    // route to quotation editor
  }

  getDemoData() {
    for (let x = 1; x < 11; x++) {
      const quotation = {
        id: `${x}`,
        client: `client ${x}`,
        created: moment().format("MMMM Do YYYY"),
        total: x * 1000
      };

      this.items.push(quotation);
    }
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

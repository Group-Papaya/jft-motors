<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row class="my-5">
      <v-col cols="12" md="6">
        <!-- quotation card -->
        <app-material-card color="warning" class="px-5 py-3">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">Quotations</div>
            <div class="subtitle-1 font-weight-light">
              Quotations for month of {{ currentMonth }}
            </div>
          </template>

          <!-- TODO: add quotation button-->
          <v-card-text>
            <!-- quotation list -->
            <v-data-table
              :headers="quotationTableHeaders"
              :items="quotationItems"
            ></v-data-table>
          </v-card-text>
        </app-material-card>
      </v-col>

      <v-col cols="12" md="6">
        <!-- invoice card -->
        <app-material-card color="success" class="px-5 py-3">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">Invoices</div>
            <div class="subtitle-1 font-weight-light">
              Invoices for month of {{ currentMonth }}
            </div>
          </template>

          <v-card-text>
            <!--  TODO: change to invoice headers and invoice buttons -->
            <!-- invoice list -->
            <v-data-table
              :headers="quotationTableHeaders"
              :items="quotationItems"
            ></v-data-table>
          </v-card-text>
        </app-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";
import { Quotation } from "@/models";
import firebase from "firebase";

@Component
export default class Dashboard extends Vue {
  // quotation table header
  quotationTableHeaders = [
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
  quotationItems: any[] = [];

  // get current  month
  currentMonth = moment().format("MMMM");

  mounted() {
    this.getDemoData();
  }

  getDemoData() {
    for (let x = 1; x < 11; x++) {
      const quotation = {
        id: `${x}`,
        client: `client ${x}`,
        created: moment().format("MMMM Do YYYY"),
        total: x * 1000
      };

      this.quotationItems.push(quotation);
    }
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

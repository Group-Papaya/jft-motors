<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12" md="6">
        <v-card style="padding: 10px">
          <apex-chart
            type="bar"
            :series="series"
            :options="options"
          ></apex-chart>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card style="padding: 10px">
          <apex-chart
            type="line"
            :series="series"
            :options="options"
          ></apex-chart>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card style="padding: 10px">
          <apex-chart
            type="bar"
            :series="series"
            :options="options"
          ></apex-chart>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VueApexCharts from "vue-apexcharts";
import { range } from "@/utils";
import { Quotation } from "@/models";

Vue.component("apex-chart", VueApexCharts);

@Component({
  components: { VueApexCharts }
})
export default class Reports extends Vue {
  name = "Reports";

  daysLastMonth() {
    const current = new Date();
    const date = new Date(
      current.getFullYear(),
      current.getMonth() - 1,
      0
    ).getDate();
    return range(1, date);
  }

  invoices() {
    const sorted: Array<Quotation> = this.$store.getters.invoices.sort(
      (a, b) => new Date(a.updated).valueOf() - new Date(b.updated).valueOf()
    );

    return sorted
      .reduce((previous, invoice) => {
        const date = new Date(invoice.updated).getDate();
        previous[date] += invoice.total;
        return previous;
      }, Array(31).fill(0, 1, 31))
      .filter(it => it >= 0);
  }

  mounted() {
    console.log(this.invoices());
  }

  options = {
    chart: {
      id: "chart"
    },
    xaxis: {
      categories: this.daysLastMonth()
    }
  };

  series = [
    {
      name: "Last Month",
      data: [
        1812,
        3444,
        3455,
        4542,
        4454,
        3343,
        4233,
        7320,
        1812,
        3444,
        3455,
        4542,
        4454,
        3343,
        1812,
        3444,
        3455,
        4542,
        4454,
        3343,
        4233,
        7320,
        1812,
        3444,
        3455,
        4542,
        4454,
        3343,
        4233
      ]
    },
    {
      name: "Current Month",
      data: this.invoices()
    }
  ];
}
</script>

<style scoped></style>

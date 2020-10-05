<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12" md="6">
        <v-card style="padding: 10px">
          <apex-chart
            type="area"
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
      <!-- TODO: A table below the two charts, showing the accounted invoices per day from last month -->
      <v-col cols="12">
        <v-card style="padding: 10px">
          <div class="px-md-10 pb-16">
            <v-col col="12">
              <v-row>
                <v-col>
                  <div class="caption font-weight-bold">
                    Invoices from Last Month
                  </div>
                </v-col>
              </v-row>
            </v-col>

            <v-divider class="my-4" light></v-divider>

            <v-card flat>
              <v-card-text>
                <v-row class="py-0 my-0">
                  <v-col cols="1">Date</v-col>
                  <v-col cols="3" class="text-left caption font-weight-bold"
                    >Created By</v-col
                  >
                  <v-col cols="1" class="text-right caption font-weight-bold"
                    >Discounts</v-col
                  >
                  <v-col cols="2" class="text-right caption font-weight-bold"
                    >Sub Total</v-col
                  >
                  <v-col cols="3" class="text-right caption font-weight-bold"
                    >Total</v-col
                  >
                  <v-col cols="2" class="text-right"></v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- invoice total on day - items -->
            <div>
              <v-col class="py-0 px-0 my-1">
                <v-card outlined hover>
                  <v-card-text
                    v-for="(total, day) in invoiceTableData.items"
                    class="py-0 px-0 my-1"
                    :key="day"
                  >
                    <v-row>
                      <v-col cols="1" class="text-left">
                        <v-chip small>03/10</v-chip>
                      </v-col>
                      <v-col cols="3" class="text-left">{{ total }}</v-col>
                      <v-col cols="1" class="text-right"></v-col>
                      <v-col cols="2" class="text-right"> </v-col>
                      <v-col class="text-right"> </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </div>

            <v-divider class="mt-10 mb-4" light></v-divider>

            <!--  totals -->
            <v-row class="text-right">
              <v-col>
                <div class="caption font-weight-bold">
                  Monthly: Discount Total
                </div>
                <div class="body-2">R{{ invoiceTableData.discount() }}</div>
              </v-col>
              <v-col>
                <div class="caption font-weight-bold">Monthly: Sub Total</div>
                <div class="body-2">R{{ invoiceTableData.sub() }}</div>
              </v-col>
              <v-col>
                <div class="caption font-weight-bold">Monthly: Grand Total</div>
                <div class="body-2">R{{ invoiceTableData.total() }}</div>
              </v-col>
            </v-row>
          </div>
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

  /**
   * Gets an array of all the day from the
   * last month using the native date
   *
   * @return number[]
   * */
  daysLastMonth() {
    const current = new Date();
    const date = new Date(
      current.getFullYear(),
      current.getMonth() - 1,
      0
    ).getDate();
    return range(1, date);
  }

  /**
   * This would ideally return all invoices collected
   * from the previous month where each day of the month
   * has the total invoiced amount for evey invoice
   * of that day until the last day of the month
   *
   * @return number[]
   * */
  previousInvoices() {
    // TODO:
    return [
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
    ];
  }

  /**
   * Returns all the calculated and invoiced quotations
   * from the current period (from the start of the month)
   *
   * @return number[]
   * */
  currentInvoices() {
    // TODO:
    return [
      1112,
      3454,
      3455,
      1452,
      2454,
      6453,
      7453,
      8450,
      5152,
      6154,
      3155,
      2142,
      3154,
      3143,
      8112,
      9144
    ];
  }

  /**
   * This invoices are to be index with there date
   * each index/date would contain the total
   * of that day for invoices
   *
   * @return object
   * */
  get invoiceTableData() {
    const invoices = [];

    return {
      items: invoices,
      sub: () => invoices.reduce((last, next) => last + next, 0),
      total: () => invoices.reduce((last, next) => last + next, 0),
      discount: () => invoices.reduce((last, next) => last + next, 0)
    };
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

  options = {
    chart: {
      id: "chart"
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: this.daysLastMonth()
    }
  };

  series = [
    {
      name: "Last Month",
      data: this.previousInvoices()
    },
    {
      name: "Current Month",
      data: this.currentInvoices()
    }
  ];
}
</script>

<style scoped></style>

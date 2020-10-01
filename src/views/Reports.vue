<template>
  <div>
    <apex-chart
      type="bar"
      width="680"
      :options="options"
      :series="series"
    ></apex-chart>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import VueApexCharts from "vue-apexcharts";

Vue.component("apex-chart", VueApexCharts);

@Component({
  components: { VueApexCharts }
})
export default class Reports extends Vue {
  name = "Reports";

  options = {
    chart: {
      id: "chart"
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
    }
  };

  series = [
    {
      name: "Vue Chart",
      data: [30, 40, 45, 50, 49, 60, 70, 81]
    }
  ];
}
</script>

<style scoped></style>

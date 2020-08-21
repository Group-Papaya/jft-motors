<template>
  <AppManager
    title="Invoices"
    icon="mdi-note-text"
    :items="items"
    :button="false"
    color="primary"
    :headers="headers"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";
import AppManager from "@/components/layouts/AppManager.vue";

@Component({
  components: { AppManager }
})
export default class Invoices extends Vue {
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
      text: "date",
      value: "created"
    },
    {
      sortable: false,
      text: "total",
      value: "total"
    }
  ];

  items: any[] = [];

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

      this.items.push(quotation);
    }
  }
}
</script>

<style scoped></style>

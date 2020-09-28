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
      text: "Client",
      value: "client"
    },
    {
      sortable: false,
      text: "Invoice Date",
      value: "updated"
    },
    {
      sortable: false,
      text: "Total",
      value: "format"
    }
  ];

  get items() {
    return this.$store.getters.invoices;
  }
}
</script>

<style scoped></style>

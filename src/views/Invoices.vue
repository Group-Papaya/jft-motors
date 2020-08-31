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
import { watchCollection } from "@/services/curd.service";

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

  get items() {
    return this.$store.getters.invoices;
  }

  created() {
    watchCollection("quotations", data =>
      this.$store.commit("SET_RECORDS", { quotations: data })
    );
  }
}
</script>

<style scoped></style>

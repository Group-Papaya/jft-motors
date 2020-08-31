<template>
  <AppManager
    title="Quotations"
    :model="model"
    :schema="schema"
    :addHandler="addQuotation"
    icon="mdi-note"
    :items="items"
    :headers="headers"
  />
</template>

<script lang="ts">
import moment from "moment";
import { Component, Vue } from "vue-property-decorator";
import AppManager from "@/components/layouts/AppManager.vue";
import Quotation from "@/models/Quotation";
import { watchCollection } from "@/services/curd.service";
import { auth } from "firebase";

@Component({
  components: { AppManager }
})
export default class Quotations extends Vue {
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
      text: "modified",
      value: "updated"
    },
    {
      sortable: false,
      text: "total",
      value: "total"
    },
    {
      sortable: false,
      text: "Actions",
      value: "actions"
    }
  ];

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

  get items() {
    return this.$store.state.records.quotations;
  }

  created() {
    watchCollection("quotations", data =>
      this.$store.commit("SET_RECORDS", { quotations: data })
    );
  }

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
}
</script>

<style scoped lang="scss"></style>

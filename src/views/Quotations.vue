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

  items: any[] = [];

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
        updated: moment().format("MMMM Do YYYY"),
        total: x * 1000
      };

      this.items.push(quotation);
    }
  }
}
</script>

<style scoped lang="scss"></style>

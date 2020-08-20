<template>
  <AppEditor :title="name" icon="mdi-note" :items="items" :headers="headers" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";
import AppEditor from "@/components/layouts/AppEditor.vue";

@Component({
  components: { AppEditor }
})
export default class Quotations extends Vue {
  name = "Quotations";
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
        updated: moment().format("MMMM Do YYYY"),
        total: x * 1000
      };

      this.items.push(quotation);
    }
  }
}
</script>

<style scoped lang="scss"></style>

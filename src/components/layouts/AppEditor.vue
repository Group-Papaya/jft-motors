<template>
  <v-container :id="title" fluid tag="section" class="my-5">
    <app-material-card
      color="warning"
      :icon="icon"
      :title="title"
      :button="true"
      class="px-5 py-3"
    >
      <!-- quotation list -->
      <v-data-table :headers="headers" :items="items">
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </app-material-card>
  </v-container>
</template>

<script>
export default {
  name: "AppEditor",

  props: {
    title: {
      type: String,
      default: ""
    },
    items: {
      type: Array,
      default: () => []
    },
    headers: {
      type: Array,
      default: () => []
    },
    icon: {
      type: String,
      default: ""
    }
  },
  methods: {
    editItem: item => {
      console.log(item);
    },
    deleteItem: item => {
      console.log(item);
    }
  },
  computed: {}
};
</script>

<style scoped></style>

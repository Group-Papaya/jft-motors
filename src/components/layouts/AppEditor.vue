<template>
  <v-container :id="title" fluid tag="section" class="my-5">
    <app-material-card
      color="warning"
      :icon="icon"
      :title="title"
      :button="true"
      v-on:openDialog="openAddDialog"
      class="px-5 py-3"
    >
      <!-- data list -->
      <v-data-table :headers="headers" :items="items">
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click.stop="openEditDialog(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)" color="red">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </app-material-card>

    <!-- modal component -->
    <ItemDialog
      ref="itemDialog"
      :model="model"
      :schema="schema"
      :addHandler="addHandler"
      :editHandler="editHandler"
    />
  </v-container>
</template>

<script lang="ts">
import ItemDialog from "@/components/ItemDialog.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import router from "@/router";

@Component({
  components: { ItemDialog }
})
export default class AppEditor extends Vue {
  name = "AppEditor";

  @Prop({ type: String, default: undefined }) readonly title:
    | string
    | undefined;

  @Prop({ type: Array, default: () => [] }) items: any[] | undefined;

  @Prop({ type: Array, default: () => [] }) headers: any[] | undefined;

  @Prop({ type: String, default: undefined }) readonly icon: string | undefined;

  @Prop({ type: Object, default: undefined }) readonly model: any | undefined;

  @Prop({ type: Object, default: undefined }) readonly schema: any | undefined;

  @Prop({ type: Function, default: undefined }) readonly addHandler:
    | Function
    | undefined;

  @Prop({ type: Function, default: undefined }) readonly editHandler:
    | Function
    | undefined;

  openAddDialog(event: any) {
    this.dialogRef.showDialog(true);
  }

  openEditDialog = (item: any) => {
    // type is quotation open edit quotation screen
    if (this.title === "Quotations") {
      router.push({ path: `quotations/${item.id}` });
    } else if (this.title === "Invoices") {
      router.push({ path: `invoices/${item.id}` });
    } else {
      this.dialogRef.showDialog(false, item);
    }
  };

  deleteItem(item: any) {
    // delete item from firebase
    console.log(item.id);
  }

  get dialogRef() {
    return this.$refs.itemDialog as Vue & {
      showDialog: (create?: boolean, item?: any) => Function;
    };
  }
}
</script>

<style scoped lang="scss"></style>

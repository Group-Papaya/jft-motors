<template>
  <v-container :id="title" fluid tag="section" class="my-5">
    <app-material-card
      :icon="icon"
      :color="color"
      :title="title"
      :button="button"
      :subtitle="subtitle"
      v-on:openDialog="openAddDialog"
      class="px-5 py-3"
    >
      <!-- data list -->

      <v-data-table
        :items="items"
        :headers="headers"
        @click:row="openEditDialog"
      >
        <template v-slot:item.id="{ item }">
          <v-chip
            :color="title === 'Invoices' ? 'primary' : 'warning'"
            class="px-2"
            small
          >
            #{{ items.map(x => x.id).indexOf(item.id) + 1 }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click.stop="openEditDialog(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click.stop="deleteItem(item)" color="red">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </app-material-card>

    <!-- modal component -->
    <AppManagerDialog
      ref="itemDialog"
      :model="model"
      :schema="schema"
      :add-handler="addHandler"
      :edit-handler="editHandler"
      :watch-handler="watchHandler"
      :on-show-dialog="onShowDialog"
      :change-handler="changeHandler"
    />

    <AppConfirmDialog ref="confirm" />
  </v-container>
</template>

<script lang="ts">
import AppManagerDialog from "@/components/layouts/AppManagerDialog.vue";
import AppConfirmDialog from "@/components/layouts/AppConfirmDialog.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import router from "@/router";
import { curd } from "@/services/curd.service";

@Component({
  components: { AppManagerDialog, AppConfirmDialog }
})
export default class AppEditor extends Vue {
  name = "AppManager.vue";

  @Prop({
    type: Function,
    default: () => undefined
  })
  readonly changeHandler: Function | undefined;

  @Prop({
    type: Function,
    default: () => undefined
  })
  readonly watchHandler: Function | undefined;

  @Prop({
    type: Function,
    default: () => undefined
  })
  readonly onShowDialog: Function | undefined;

  @Prop({
    type: Function,
    default: (result: boolean, item: any) => {
      if (result) curd.delete(item.path);
    }
  })
  readonly onDeleteDialog: (result: any, item: any) => any | undefined;

  @Prop({ type: String, default: undefined }) readonly title:
    | string
    | undefined;
  @Prop({ type: String, default: undefined }) readonly subtitle:
    | string
    | undefined;

  @Prop({ type: Boolean, default: true }) readonly button: boolean | undefined;

  @Prop({ type: String, default: "warning" }) readonly color:
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

    this.$dialog
      .confirm({
        text: `Confirm Delete`,
        title: "You are about to delete this item"
      })
      .then(result => this.onDeleteDialog(result, item));
  }

  get dialogRef() {
    return this.$refs.itemDialog as Vue & {
      showDialog: (create?: boolean, item?: any) => Function;
    };
  }

  get confirmDialog() {
    return this.$refs.confirm as Vue & {
      showDialog: (
        headline: string,
        message: string,
        close: (result: boolean) => void
      ) => Function;
    };
  }
}
</script>

<style scoped lang="scss"></style>

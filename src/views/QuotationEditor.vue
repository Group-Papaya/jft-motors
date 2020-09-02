<template>
  <v-container :id="name" fluid tag="section" class="my-5">
    <!--  quotation menu      -->
    <v-row class="mb-8 flex-row flex-sx-column">
      <v-col cols="9">
        <v-row col="12" class="justify-md-center ml-1">
          <v-btn width="100" color="warning">Draft</v-btn>
          <v-btn width="100" light @click="markComplete()">Complete</v-btn>
        </v-row>
      </v-col>
      <v-col cols="3">
        <v-row col="12" class="justify-end mr-1">
          <v-btn
            color="warning"
            class="d-none d-sm-flex"
            @click="deleteQuotation()"
          >Delete Quotation</v-btn>
          <v-btn
            fab
            right
            x-small
            color="warning"
            class="d-flex d-sm-none"
            @click="deleteQuotation()"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-row>
      </v-col>
    </v-row>

    <!--  page   -->
    <app-material-card
      color="warning"
      icon="mdi-note"
      max-width="800px"
      class="px-5 py-3 mx-md-auto"
    >
      <div class="px-md-10 pb-16">
        <!-- quotation header     -->
        <v-col col="12">
          <v-row>
            <v-col>
              <div class="caption font-weight-bold">Quotation #</div>
              <div class="body-2" v-text="quotation.id"></div>
            </v-col>
            <v-col>
              <div class="caption font-weight-bold">Client</div>
              <div class="body-2" v-text="quotation.client"></div>
            </v-col>
            <v-col>
              <div class="caption font-weight-bold">Prepared By</div>
              <div class="body-2">{{user}}</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div class="caption font-weight-bold">Created</div>
              <div class="body-2" v-text="quotation.created"></div>
            </v-col>
            <v-col>
              <div class="caption font-weight-bold">Modified</div>
              <div class="body-2" v-text="quotation.updated"></div>
            </v-col>
            <v-col>
              <div class="caption font-weight-bold"></div>
              <div class="body-2"></div>
            </v-col>
          </v-row>
        </v-col>

        <v-divider class="my-4" light></v-divider>

        <v-row col="12" class="justify-end align-center">
          <v-btn class="d-none d-sm-flex" @click="openModal(true)" color="warning">Add Line Item</v-btn>
          <v-btn fab right x-small color="warning" class="d-flex d-sm-none" @click="openModal(true)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-row>

        <v-divider class="my-4" light></v-divider>

        <!-- quotation line item header -->
        <v-card flat>
          <v-card-text>
            <v-row class="py-0 my-0">
              <v-col cols="1">#</v-col>
              <v-col cols="3" class="text-left caption font-weight-bold">Line Item Name</v-col>
              <v-col cols="1" class="text-right caption font-weight-bold">Qty</v-col>
              <v-col cols="2" class="text-right caption font-weight-bold">Discount</v-col>
              <v-col cols="3" class="text-right caption font-weight-bold">Price</v-col>
              <v-col cols="2" class="text-right"></v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- quotation line items -->
        <div v-if="quotation.items">
          <v-col class="py-0 my-1" v-for="(item, index) in quotation.items" :key="item.id">
            <AppQuotationItem :item="item" :position="index" v-on:edit-line-item="openModal" v-on:delete-line-item="deleteLineItem"></AppQuotationItem>
          </v-col>
        </div>


          <v-row class="text-right">
            <v-col>
              <div class="caption font-weight-bold">Discount Total</div>
              <div class="body-2">{{ discountTotal | currency("R", 2) }}</div>
            </v-col>
            <v-col>
              <div class="caption font-weight-bold">Sub Total</div>
              <div class="body-2">{{ total | currency("R", 2) }}</div>
            </v-col>
            <v-col>
              <div class="caption font-weight-bold">Grand Total</div>
              <div class="body-2">{{ total - discountTotal | currency("R", 2) }}</div>
            </v-col>
          </v-row>

      </div>
    </app-material-card>

    <!--   add line item to quotation dialog   -->
    <AppAddLineItemToQuotation ref="lineItemDialog" :addHandler="addLineItem" :editHandler="editLineItem" :quotation="quotation"/>

  </v-container>
</template>

<script lang="ts">
import { Component, Vue} from "vue-property-decorator";
import { LineItem, Quotation} from "@/models";

import VFormBase from "../../node_modules/vuetify-form-base/dist/src/vFormBase.vue";
import { watchCollection, curd } from "@/services/curd.service";
import { db } from "@/firebase";
import AppQuotationItem from "@/components/layouts/AppQuotationItem.vue";
import AppAddLineItemToQuotation from "@/components/layouts/AppAddLineItemToQuotation.vue"

@Component({
  components: { VFormBase, AppQuotationItem, AppAddLineItemToQuotation }
})
export default class QuotationEditor extends Vue {
  name = "QuotationEditor";
  quotation!: Quotation;
  quotationDiscount = 0;
  addLineItemDialog = false;

  item: LineItem = {
    id: "",
    cost: 0,
    name: "",
    type: "",
    units: 0,
    quantity: 0,
    details: "",
    discounted: false,
    path: ""
  };

  lineItems: Array<LineItem> = Array<LineItem>();

  rowAttribute = { justify: "center", align: "center", noGutters: true };

  schema = {
    quantity: {
      value: 0,
      type: "number",
      label: "Quantity"
    },
    cost: {
      value: 0,
      type: "number",
      label: "Cost",
      disabled: true
    },
    discount: {
      value: false,
      type: "switch",
      label: "Apply discount",
      disabled: true
    }
  };

  itemsWatcher: any = null;

  created() {
    this.lineItems = this.getLineItems();
    this.getQuotation(this.$route.params.id);

    this.itemsWatcher = watchCollection(
      `${this.quotation.path}/items`,
      items => (this.quotation.items = items)
    );
  }

  destroyed() {
    this.itemsWatcher();
  }

  getLineItems() {
    return this.$store.state.records.lineitems;
  }

  getQuotation(id: string) {
    this.quotation = this.$store.getters.getQuotation(id);
  }

  openModal(add: boolean,item?: LineItem) {
      this.dialogRef.showDialog(add, item);
  }

  addLineItem(item: LineItem) {
    // console.log(item)
    this.addLineItemDialog = false;
    this.quotation.items.push(item);
    this.$store.dispatch("SET_RECORD", {
      record: { ...item, reference: db.doc(`${item.path}`) },
      path: `${this.quotation.path}/items`,
      ref: item.id
    });
  }

  editLineItem(item: LineItem) {
    // this.$store.dispatch("SET_RECORD", { item, path: item.path });
    curd.update(item, item.path as string)
  }

  async deleteLineItem (item: LineItem) {
    const res = await this.$dialog.confirm({
      text: `Do you want to remove '${item.name}' from quotation?`,
      title: 'Delete Line Item'
    })
    if (res) {
     await curd.delete(item.path as string);
    }
  }

  deleteQuotation() {
    console.log(this.quotation.id);
  }

  markComplete() {
    console.log("completed");
  }

  get discountTotal() {
    return 0;
  }

  get dialogRef() {
    return this.$refs.lineItemDialog as Vue & {
      showDialog: (add?: boolean, item?: any) => Function;
    };
  }

  get user() {
    const user = this.$store.getters.getUser(this.quotation.user);
    return `${user.firstname} ${user.lastname}`;
  }

  get total() {
    return this.quotation.items?.reduce((total, item) => {
      return total + item.cost * item.quantity;
    }, 0);
  }
}
</script>

<style lang="scss" scoped></style>

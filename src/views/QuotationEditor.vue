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
            >Delete Quotation
          </v-btn>
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
              <div class="body-2" >{{user}}</div>
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
          <v-btn class="d-none d-sm-flex" @click="openModal()" color="warning"
            >Add Line Item
          </v-btn>
          <v-btn
            fab
            right
            x-small
            color="warning"
            class="d-flex d-sm-none"
            @click="openModal()"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-row>

        <v-divider class="my-4" light></v-divider>

        <!-- quotation line items -->
        <v-simple-table v-if="quotation.items">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">#</th>
                <th class="text-left">Name</th>
                <th class="text-left">Qty</th>
                <th class="text-left">Discount</th>
                <th class="text-left">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in quotation.items" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.quantity }}</td>
                <td>
                  {{
                    (item.discounted ? item.discount : "0") | currency("R", 2)
                  }}
                </td>
                <td>{{ item.cost | currency("R", 2) }}</td>
              </tr>
              <tr>
                <td></td>
                <td class="font-weight-bold">Sub Total</td>
                <td></td>
                <td class="font-weight-bold red--text">
                  -{{ discountTotal | currency("R", 2) }}
                </td>
                <td class="font-weight-bold">{{ total | currency("R") }}</td>
              </tr>
              <tr>
                <td></td>
                <td class="font-weight-bold">Discount</td>
                <td></td>
                <td></td>
                <td class="font-weight-bold red--text">
                  -{{ quotationDiscount | currency("R", 2) }}
                </td>
              </tr>
              <tr>
                <td></td>
                <td class="font-weight-bold">Total</td>
                <td></td>
                <td></td>
                <td class="font-weight-bold">
                  {{
                    (total - discountTotal - quotationDiscount)
                      | currency("R", 2)
                  }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </app-material-card>

    <!--   add line item to quotation dialog   -->
    <v-dialog v-model="addLineItemDialog" max-width="600">
      <v-card>
        <v-card-title>Add Line Item to Quotation</v-card-title>
        <v-card-text>
          <v-form>
            <v-autocomplete
              label="Line item"
              :v-model="item"
              :items="lineItems"
              :item-text="value => value.name"
              :item-value="value => lineItems.find(it => it.id === value.id)"
              @change="value => (item = value)"
            />
            <v-form-base
              :col="12"
              :model="item"
              :schema="schema"
              :row="rowAttribute"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="warning" @click="addLineItem(item)"
            >Add Line Item</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Vue, Watch } from "vue-property-decorator";
import { LineItem, Quotation, Client, User } from "@/models";
import { PRODUCT, WORKER } from "@/models/LineItem";

import VFormBase from "../../node_modules/vuetify-form-base/dist/src/vFormBase.vue";
import { watchCollection } from "@/services/curd.service";
import store from "@/store";
import { db } from "@/firebase";
import { dbService } from "@/services/firestore.service";
import { forEach } from "lodash";

@Component({
  components: { VFormBase }
})
export default class QuotationEditor extends Mixins() {
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

  openModal() {
    this.addLineItemDialog = true;
  }

  addLineItem(item: LineItem) {
    this.addLineItemDialog = false;
    this.quotation.items.push(item);
    this.$store.dispatch("SET_RECORD", {
      record: { ...item, reference: db.doc(`${item.path}`) },
      path: `${this.quotation.path}/items`,
      ref: item.id
    });
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

  get user () {
    const user = this.$store.getters.getUser(this.quotation.user);
    return `${user.firstname} ${user.lastname}`
  }

  get total() {
    return this.quotation.items?.reduce((total, item) => {
      return total + item.cost * item.quantity;
    }, 0);
  }
}
</script>

<style lang="scss" scoped></style>

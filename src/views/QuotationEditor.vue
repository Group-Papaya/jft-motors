<template>
  <v-container :id="name" fluid tag="section" class="my-5">
    <!--  quotation menu      -->
    <v-row class="mb-8 flex-row flex-sx-column">
      <v-col cols="12">
        <v-row class="justify-md-center ml-1">
          <!--          <v-btn-toggle dense>-->
          <!--            <v-btn @click="sendEmail()">Send Email</v-btn>-->
          <!--            <v-btn @click="downloadPDF()">Print PDF</v-btn>-->
          <!--          </v-btn-toggle>-->
          <v-menu>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                @click="generatePdf()"
                :disabled="loading"
              >
                GENERATE PDF
              </v-btn>
            </template>
            <v-list v-if="!loading">
              <v-list-item @click="viewPDF()">
                <v-list-item-title>VIEW PDF</v-list-item-title>
              </v-list-item>

              <v-list-item @click="sendEmail()">
                <v-list-item-title>EMAIL PDF</v-list-item-title>
              </v-list-item>

              <v-list-item @click="downloadPDF()">
                <v-list-item-title>DOWNLOAD PDF</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
      </v-col>
    </v-row>

    <!--  page   -->
    <app-material-card
      ref="quotationPage"
      :color="color"
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
              <div class="body-2" v-text="quotation.user"></div>
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

        <v-row col="12" class="justify-space-between align-center">
          <v-btn-toggle mandatory v-model="isCompleted" borderless dense>
            <v-btn :value="false">Draft</v-btn>
            <v-btn :value="true">Complete</v-btn>
          </v-btn-toggle>

          <v-btn
            class="d-none d-sm-flex"
            @click="openModal(true)"
            v-if="!isCompleted"
            :color="color"
            >Add Line Item
          </v-btn>
          <v-btn
            fab
            right
            x-small
            :color="color"
            v-if="!isCompleted"
            class="d-flex d-sm-none"
            @click="openModal(true)"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-row>

        <v-divider class="my-4" light></v-divider>

        <!-- quotation line item header -->
        <v-card flat v-if="quotation.items.length">
          <v-card-text>
            <v-row class="py-0 my-0">
              <v-col cols="1">#</v-col>
              <v-col cols="3" class="text-left caption font-weight-bold"
                >Line Item Name
              </v-col>
              <v-col cols="1" class="text-right caption font-weight-bold"
                >Qty
              </v-col>
              <v-col cols="2" class="text-right caption font-weight-bold"
                >Discount
              </v-col>
              <v-col cols="3" class="text-right caption font-weight-bold"
                >Price
              </v-col>
              <v-col cols="2" class="text-right" v-if="isCompleted"></v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- quotation line items -->
        <div v-if="quotation.items.length">
          <v-col
            :key="item.key"
            class="py-0 px-0 my-1"
            v-for="(item, index) in quotation.items"
          >
            <AppQuotationItem
              :color="color"
              :item="item"
              :position="index"
              v-on:edit-line-item="openModal"
              v-on:delete-line-item="deleteLineItem"
            ></AppQuotationItem>
          </v-col>
        </div>

        <v-divider
          class="mt-10 mb-4"
          light
          v-if="quotation.items.length"
        ></v-divider>

        <!--  totals -->
        <v-row class="text-right" v-if="quotation.items.length">
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
            <div class="body-2">
              {{ (total - discountTotal) | currency("R", 2) }}
            </div>
          </v-col>
        </v-row>

        <v-row v-else>
          <div>No items have been added to the quotation yet.</div>
        </v-row>
      </div>
    </app-material-card>

    <!--   add line item to quotation dialog   -->
    <AppAddLineItemToQuotation
      ref="lineItemDialog"
      :addHandler="addLineItem"
      :editHandler="editLineItem"
      :quotation="quotation"
    />

    <AppOverlay :show="loading" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { LineItem, Quotation } from "@/models";

import VFormBase from "../../node_modules/vuetify-form-base/dist/src/vFormBase.vue";
import { curd, watchDocument } from "@/services/curd.service";
import { db } from "@/firebase";
import AppQuotationItem from "@/components/layouts/AppQuotationItem.vue";
import AppAddLineItemToQuotation from "@/components/layouts/AppAddLineItemToQuotation.vue";
import AppOverlay from "@/components/layouts/AppOverlay.vue";

import firebase from "firebase";
import {
  downloadInvoice,
  emailInvoice,
  generatePDF
} from "@/services/pdf.service";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const easyInvoice = require("easyinvoice");

@Component({
  components: {
    VFormBase,
    AppQuotationItem,
    AppAddLineItemToQuotation,
    AppOverlay
  }
})
export default class QuotationEditor extends Vue {
  name = "QuotationEditor";
  quotation!: Quotation;
  quotationDiscount = 0;

  addLineItemDialog = false;

  item: LineItem = {
    format: "",
    name: "",
    type: "",
    cost: 0,
    units: 0,
    details: "",
    quantity: 0,
    discount: "",
    discounted: false
  };

  items = [
    { title: "VIEW PDF" },
    { title: "EMAIL PDF" },
    { title: "PRINT PDF" }
  ];

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
  loading = false;

  created() {
    this.lineItems = this.getLineItems();
    this.getQuotation(this.$route.params.id);

    this.itemsWatcher = watchDocument(
      { path: this.quotation.path as string },
      (it: Quotation) => (this.quotation.items = it.items)
    );
  }

  mounted() {
    const recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute(
      "src",
      "https://unpkg.com/pdfjs-dist/build/pdf.min.js"
    );

    const recaptchaScriptTwo = document.createElement("script");
    recaptchaScriptTwo.setAttribute(
      "src",
      "https://unpkg.com/pdfjs-dist/build/pdf.worker.min.js"
    );

    document.head.appendChild(recaptchaScript);
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

  openModal(add: boolean, item?: LineItem) {
    this.dialogRef.showDialog(add, item);
  }

  updateQuotation(quotation: Quotation) {
    return this.$store.dispatch("SET_RECORD", {
      record: { ...quotation, total: this.total, format: `R${this.total}` },
      path: "quotations",
      ref: quotation.id
    });
  }

  addLineItem(item: LineItem) {
    this.addLineItemDialog = false;
    this.quotation.items.push({
      ...item,
      key: this.quotation.items.length + 1
    });
    this.$store.dispatch("SET_RECORD", {
      record: { ...item, reference: db.doc(`${item.path}`).path },
      path: `${this.quotation.path}/items`,
      ref: item.id
    });

    this.updateQuotation(this.quotation);
  }

  editLineItem(item: LineItem) {
    curd.update(item, item.path as string);
  }

  async deleteLineItem(item: LineItem) {
    const res = await this.$dialog.confirm({
      text: `Do you want to remove '${item.name}' from quotation?`,
      title: "Delete Line Item"
    });
    if (res) {
      this.quotation.items = await curd
        .delete(item.path as string)
        .then(() => this.quotation.items.filter(it => it.id !== item.id));
      await this.updateQuotation(this.quotation);
    }
  }

  get discountTotal() {
    return this.quotation.items?.reduce(
      (total, item) => total + item.meta.discount.value,
      0
    );
  }

  get dialogRef() {
    return this.$refs.lineItemDialog as Vue & {
      showDialog: (add?: boolean, item?: any) => Function;
    };
  }

  get total() {
    return this.quotation.items?.reduce((total, item) => {
      return total + item.cost * item.quantity;
    }, 0);
  }

  get isCompleted() {
    return this.quotation.completed ? this.quotation.completed : false;
  }

  set isCompleted(value: boolean) {
    const res = this.toggleComplete(value);

    res.then(choice => {
      if (choice) {
        this.quotation.completed = value;
        // curd.update(this.quotation, this.quotation.path as string)
        this.updateQuotation(this.quotation).then();

        // if (value) {
        //   // redirect to invoice page
        //   this.$router.replace(`/invoices/${this.quotation.id}`);
        // } else {
        //   // redirect to quotation page
        //   this.$router.replace(`/quotations/${this.quotation.id}`);
        // }
      }
    });
  }

  get documentType() {
    return this.isCompleted ? "Invoice" : "Quotation";
  }

  get color() {
    return this.isCompleted ? "primary" : "warning";
  }

  async generatePdf() {
    this.loading = true;
    await generatePDF(this.quotation);
    this.loading = false;
  }

  async viewPDF() {
    console.log("I am grateful");
  }

  async sendEmail() {
    // confirm
    const res = await this.$dialog.confirm({
      text: `Attempting to launch your default email client, would you like to proceed?`,
      title: `Send ${this.documentType} e-mail`
    });

    if (res) {
      this.loading = true;
      await emailInvoice(this.quotation);
      this.loading = false;
    }
  }

  async downloadPDF() {
    // confirm
    const dialogRes = await this.$dialog.confirm({
      title: `Download ${this.documentType} PDF`,
      text: `Would you like to download ${this.documentType} PDF?`
    });

    if (dialogRes) {
      this.loading = true;
      await downloadInvoice(this.quotation);
      this.loading = false;
    }
  }

  async toggleComplete(value: boolean) {
    return await this.$dialog.confirm({
      text: value
        ? `Do you want to convert this quotation to an invoice?`
        : `Do you want to convert this invoice to a quotation?`,
      title: "Convert to Invoice"
    });
  }
}
</script>

<style lang="scss" scoped></style>

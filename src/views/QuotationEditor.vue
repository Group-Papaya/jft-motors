<template>
  <v-container :id="name" fluid tag="section" class="my-5">
    <AppOverlay :show="loading" />

    <!--  quotation menu      -->
    <v-row class="mb-8 flex-row flex-sx-column">
      <v-col class="justify-start">
        <v-btn
          fab
          left
          x-small
          :color="color"
          :to="isCompleted ? '/invoices' : '/quotations'"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-col>
      <v-col class="justify-md-center">
        <v-menu>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              :color="color"
              @click="generatePdf()"
              :disabled="loading || !quotation.items.length"
              >GENERATE PDF
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
            <v-btn :value="false" :disabled="!isCompleted">Draft</v-btn>
            <v-btn
              v-if="quotation.items.length"
              :value="true"
              :disabled="isCompleted"
              >Complete</v-btn
            >
          </v-btn-toggle>

          <v-btn
            class="d-none d-sm-flex"
            @click="openModal('lineItemDialog', true)"
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
            @click="openModal('lineItemDialog', true)"
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
                >Line Item Name</v-col
              >
              <v-col cols="1" class="text-right caption font-weight-bold"
                >Qty</v-col
              >
              <v-col cols="2" class="text-right caption font-weight-bold"
                >Discount</v-col
              >
              <v-col cols="3" class="text-right caption font-weight-bold"
                >Price</v-col
              >
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
              :item="item"
              :color="color"
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
      :quotation="quotation"
      :add-handler="addLineItem"
      :edit-handler="editLineItem"
    />

    <AppPdfViewer ref="pdfViewerDialog" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { LineItem, Quotation } from "@/models";

import VFormBase from "../../node_modules/vuetify-form-base/dist/src/vFormBase.vue";
import { curd } from "@/services/curd.service";
import AppQuotationItem from "@/components/layouts/AppQuotationItem.vue";
import AppAddLineItemToQuotation from "@/components/layouts/AppAddLineItemToQuotation.vue";
import AppOverlay from "@/components/layouts/AppOverlay.vue";
import AppPdfViewer from "@/components/layouts/AppPdfViewer.vue";

import {
  downloadInvoice,
  emailInvoice,
  generatePDF,
  renderPDFViewer
} from "@/services/pdf.service";

@Component({
  components: {
    AppPdfViewer,
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

  loading = false;

  created() {
    this.lineItems = this.getLineItems();
    this.getQuotation(this.$route.params.id);
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

  getLineItems() {
    return this.$store.state.records.lineitems;
  }

  getQuotation(id: string) {
    this.quotation = this.$store.getters.getQuotation(id);
  }

  openModal(name = "lineItemDialog", add: boolean, item?: LineItem) {
    this.getDialogRef(name).showDialog(add, item);
  }

  updateQuotation(quotation: Quotation) {
    return this.$store.dispatch("SET_RECORD", {
      record: { ...quotation, total: this.total, format: `R${this.total}` },
      path: "quotations",
      ref: quotation.id
    });
  }

  addLineItem(item: LineItem) {
    if (item.id !== "" && item.quantity !== 0) {
      this.addLineItemDialog = false;
      this.quotation.items.push({
        ...item,
        meta: {
          ...item.meta,
          key: this.quotation.items.length + 1
        }
      });
      this.updateQuotation(this.quotation);
    } else
      this.$toast.error(
        "Select an item and give it a quantity greater then zero"
      );
  }

  editLineItem(item: LineItem) {
    if (item.quantity !== 0) {
      curd.update(item, item.path as string);
    } else this.$toast.error("Line Item quantity shouldn't be Zero");
  }

  async deleteLineItem(item: LineItem) {
    const res = await this.$dialog.confirm({
      text: `Do you want to remove '${item.name}' from quotation?`,
      title: "Delete Line Item"
    });
    if (res) {
      this.quotation.items = this.quotation.items.filter(
        it => it.meta.key !== item.meta.key
      );
      await this.updateQuotation(this.quotation);
    }
  }

  get discountTotal() {
    return this.quotation.items?.reduce((total, item) => {
      return total + item.meta.discount.value;
    }, 0);
  }

  getDialogRef(name: string) {
    return this.$refs[`${name}`] as Vue & {
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
    this.toggleComplete(value).then(choice => {
      if (choice) {
        this.quotation.completed = value;
        this.updateQuotation({ ...this.quotation });
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
    this.loading = true;
    this.getDialogRef("pdfViewerDialog").showDialog();
    await renderPDFViewer();
    this.loading = false;
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

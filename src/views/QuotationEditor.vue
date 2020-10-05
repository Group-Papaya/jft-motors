<template>
  <v-container :id="name" fluid tag="section" class="my-5">
    <!-- loading screen components -->
    <AppOverlay :show="loading" />

    <!--  quotation menu   -->
    <v-row class="mb-8 flex-row flex-sx-column">
      <v-col class="justify-start">
        <!-- back button -->
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
        <!-- generate pdf button and drop menu -->
        <v-menu>
          <!-- generate pdf button -->
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

          <!-- generate pdf drop menu -->
          <v-list v-if="!loading">
            <!-- view pdf button -->
            <v-list-item @click="viewPDF()">
              <v-list-item-title>VIEW PDF</v-list-item-title>
            </v-list-item>

            <!-- email PDF button -->
            <v-list-item @click="sendEmail()">
              <v-list-item-title>EMAIL PDF</v-list-item-title>
            </v-list-item>

            <!-- download pdf button -->
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
              <!-- quotation number -->
              <div class="caption font-weight-bold">Quotation #</div>
              <div class="body-2" v-text="quotation.id"></div>
            </v-col>
            <v-col>
              <!-- client name -->
              <div class="caption font-weight-bold">Client</div>
              <div class="body-2" v-text="quotation.client"></div>
            </v-col>
            <v-col>
              <!-- logged in user name -->
              <div class="caption font-weight-bold">Prepared By</div>
              <div class="body-2" v-text="quotation.user"></div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <!-- creation date -->
              <div class="caption font-weight-bold">Created</div>
              <div class="body-2" v-text="quotation.created"></div>
            </v-col>
            <v-col>
              <!-- last modification date -->
              <div class="caption font-weight-bold">Modified</div>
              <div class="body-2" v-text="quotation.updated"></div>
            </v-col>
            <v-col>
              <!-- empty column -->
              <div class="caption font-weight-bold"></div>
              <div class="body-2"></div>
            </v-col>
          </v-row>
        </v-col>

        <v-divider class="my-4" light></v-divider>

        <v-row col="12" class="justify-space-between align-center">
          <!-- Complete / Incomplete toggle -->
          <v-btn-toggle mandatory v-model="isCompleted" borderless dense>
            <v-btn :value="false" :disabled="!isCompleted">Draft</v-btn>
            <v-btn
              v-if="quotation.items.length"
              :value="true"
              :disabled="isCompleted"
              >Complete</v-btn
            >
          </v-btn-toggle>

          <!-- add line item button -->
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
            v-for="(item, index) in lineItems"
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

        <!-- no line items text -->
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

    <!-- pdf viewer dialog -->
    <AppPdfViewer ref="pdfViewerDialog" />
  </v-container>
</template>

<script lang="ts">
// import Modules
import { Component, Vue } from "vue-property-decorator";
import { LineItem, Quotation } from "@/models";
import VFormBase from "../../node_modules/vuetify-form-base/dist/src/vFormBase.vue";
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
import moment from "moment";

// declare Quotation Editor component with nested components components
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
  // component name
  name = "QuotationEditor";

  // quotation object
  quotation!: Quotation;

  // flag to show  or hide loading screen
  loading = false;

  /**
   * Function is called automatically after component is created. Used to set up quotation editor data
   */
  created() {
    // get quotation, using the quotation id from the browser url
    this.getQuotation(this.$route.params.id);
  }

  /**
   * Function is called automatically after component is mounted.
   */
  mounted() {
    // create HTML script elements
    const recaptchaScript = document.createElement("script");
    const recaptchaScriptTwo = document.createElement("script");

    // attach pdf viewer javascript
    recaptchaScript.setAttribute(
      "src",
      "https://unpkg.com/pdfjs-dist/build/pdf.min.js"
    );
    recaptchaScriptTwo.setAttribute(
      "src",
      "https://unpkg.com/pdfjs-dist/build/pdf.worker.min.js"
    );

    // add scripts to document header (dynamically import javascript)
    document.head.appendChild(recaptchaScript);
    document.head.appendChild(recaptchaScriptTwo);
  }

  /**
   * method to get quotation
   * @param id quotation's unique id
   */
  getQuotation(id: string) {
    // get quotation from firebase / app state
    this.quotation = this.$store.getters.getQuotation(id);
  }

  /**
   * method open add line item modal
   * @param name quotation unique id
   * @param add boolean to determine if new line item is being added
   * @param item line item object (optional)
   */
  openModal(name = "lineItemDialog", add: boolean, item?: LineItem) {
    // show add line item dialog
    this.getDialogRef(name).showDialog(add, item);
  }

  /**
   * method to add line item to quotation
   * @param item line item
   */
  addLineItem(item: LineItem) {
    // add line item to items array field of quotation
    this.quotation.items.push({
      ...item,
      meta: {
        ...item.meta,
        key: this.quotation.items.length + 1
      }
    });

    // update quotation in firebase
    this.updateQuotation(this.quotation);
  }

  /**
   * method to update line item
   * @param item line item
   */
  editLineItem(item: LineItem) {
    // find index of line item that was updated
    const index = this.quotation.items.indexOf(
      this.quotation.items.find(_item => _item.id == item.id)
    );

    // update quantity at index
    this.quotation.items[index].quantity = item.quantity;

    // update quotation
    this.updateQuotation(this.quotation);
  }

  /**
   * method to delete line item
   * @param item line item
   */
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

  /**
   * method to update quotation
   * @param quotation quotation object
   */
  updateQuotation(quotation: Quotation) {
    return this.$store.dispatch("SET_RECORD", {
      record: {
        ...quotation,
        total: this.total,
        format: `R${this.total}`,
        updated: moment().format("MMMM Do YYYY")
      },
      path: "quotations",
      ref: quotation.id
    });
  }

  /**
   * method to get HTML element referece by name
   * @param name reference name
   */
  getDialogRef(name: string) {
    return this.$refs[`${name}`] as Vue & {
      showDialog: (add?: boolean, item?: any) => Function;
    };
  }

  /**
   * generates pdf
   */
  async generatePdf() {
    // show loading screen
    this.loading = true;

    // call generate PDF function and wait
    await generatePDF(this.quotation);

    // hide loading screen
    this.loading = false;
  }

  /**
   * opens view pdf dialog
   */
  async viewPDF() {
    // show loading screen
    this.loading = true;

    // open PDF viewer dialog
    this.getDialogRef("pdfViewerDialog").showDialog();

    // call download function to render PDF to screen and wait
    await renderPDFViewer();

    // hide loading screen
    this.loading = false;
  }

  /**
   * opens systems default email client
   */
  async sendEmail() {
    // show confirmation dialog
    const res = await this.$dialog.confirm({
      text: `Attempting to launch your default email client, would you like to proceed?`,
      title: `Send ${this.documentType} e-mail`
    });

    // if user's response is yes
    if (res) {
      // show loading screen
      this.loading = true;

      // call download invoice and wait
      await emailInvoice(this.quotation);

      // hide loading screen
      this.loading = false;
    }
  }

  /**
   * downloads pdf to computer
   */
  async downloadPDF() {
    // show confirmation dialog
    const dialogRes = await this.$dialog.confirm({
      title: `Download ${this.documentType} PDF`,
      text: `Would you like to download ${this.documentType} PDF?`
    });

    // if user's response is yes
    if (dialogRes) {
      // show loading screen
      this.loading = true;

      // call download invoice and wait
      await downloadInvoice(this.quotation);

      // hide loading screen
      this.loading = false;
    }
  }

  /**
   * @param value boolean value holding pdf
   */
  async toggleComplete(value: boolean) {
    // show confirmation dialog
    return await this.$dialog.confirm({
      text: value
        ? `Do you want to convert this quotation to an invoice?`
        : `Do you want to convert this invoice to a quotation?`,
      title: "Convert to Invoice"
    });
  }

  /**
   * GETTERS
   */
  get discountTotal() {
    return this.quotation.items?.reduce((total, item) => {
      return total + item.meta.discount.value;
    }, 0);
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

  get lineItems() {
    return this.quotation.items;
  }
}
</script>

<style lang="scss" scoped></style>

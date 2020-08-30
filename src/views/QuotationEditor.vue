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
                    </v-btn
                    >
                    <v-btn
                            fab
                            right
                            x-small
                            color="warning"
                            class="d-flex d-sm-none"
                            @click="addLineItem()"
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
                :title="'Quotation ' + quotationId"
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

                <v-row col="12" class="justify-end align-center">
                    <v-btn class="d-none d-sm-flex" @click="openModal()" color="warning"
                    >Add Line Item
                    </v-btn
                    >
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
                <v-simple-table v-if="quotation.items.length">
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
                        <tr v-for="(item, index) in quotation.items" :key="item.id">
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
                        <v-form-base
                                :row="rowAttribute"
                                :col="12"
                                :model="model"
                                :schema="schema"
                                @change="handleInput"
                        />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="warning" @click="addLineItem(model)">Add Line Item</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script lang="ts">
    import {Component, Mixins, Vue, Watch} from "vue-property-decorator";
    import {LineItem, Quotation, Client, User} from "@/models";
    import {PRODUCT, WORKER} from "@/models/LineItem";

    import VFormBase from "../../node_modules/vuetify-form-base/dist/src/vFormBase.vue";

    @Component({
        components: {VFormBase}
    })
    export default class QuotationEditor extends Mixins() {
        name = "QuotationEditor";
        addLineItemDialog = false;
        quotationId = "";
        quotation = new Quotation();
        quotationDiscount = 0;
        lineItems: any[] = [];

        rowAttribute = {justify: "center", align: "center", noGutters: true};
        model = {
            name: "",
            cost: 0,
            quantity: 0,
            discount: false
        };

        schema = {
            name: {
                type: "autocomplete",
                label: "Line item",
                items: [""]
            },
            quantity: {
                type: "number",
                label: "Quantity",
                disabled: true
            },
            cost: {
                type: "number",
                label: "Cost",
                disabled: true
            },
            discount: {
                type: "switch",
                label: "Apply discount",
                disabled: true
            }
        };

        created() {
            this.quotationId = this.$route.params.id;

            this.getDemoData();
            this.getQuotation();

            this.schema.name.items = this.lineItemNames;
        }

        getQuotation() {
            this.quotation = new Quotation();
            this.quotation.id = "1";
            this.quotation.user = "Admin";
            this.quotation.client = "Test Client";
            this.quotation.items = [];
            this.quotation.total = 9000;
            this.quotation.completed = false;
            this.quotation.created = new Date().toLocaleString();
            this.quotation.updated = new Date().toLocaleString();
        }

        openModal() {
            this.addLineItemDialog = true;
        }

        addLineItem(item: any) {
            this.addLineItemDialog = false;
            this.quotation.items?.push(JSON.parse(JSON.stringify(item)))
            this.model.name = ""
            this.model.discount = false
            this.model.cost = 0
            this.model.quantity = 0
        }

        deleteQuotation() {
            console.log(this.quotationId);
        }

        markComplete() {
            console.log("completed");
        }

        handleInput(data: any) {
            switch (data.key) {
                case "name":
                    this.schema.quantity.disabled = false
                    this.model.cost = 90;
                    break;
            }
        }

        get discountTotal() {
            return 0;
        }

        get total() {
                return this.quotation.items?.reduce((total, curr) => {
                    return total + Number.parseFloat(curr.cost) * curr.quantity;
                }, 0);
        }

        get lineItemNames() {
            return this.lineItems.map(item => {
                return item.name;
            });
        }

        getDemoData() {
            for (let x = 1; x < 5; x++) {
                const lineItem = {
                    id: `${x}`,
                    name: `line item-${x}`,
                    type: x % 2 ? WORKER : PRODUCT,
                    cost: (x * Math.random()).toFixed(3),
                    quantity: x * 2,
                    units: x * 1000,
                    discounted: false
                };
                this.lineItems.push(lineItem);
            }
        }
    }
</script>

<style lang="scss" scoped></style>

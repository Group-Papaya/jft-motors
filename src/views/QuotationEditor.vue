<template>
    <v-container :id="name" fluid tag="section" class="my-5">
        <!--  quotation menu      -->
        <v-row class="mb-8 flex-row flex-sx-column">
            <v-col cols="9">
                <v-row col="12" class="justify-md-center ml-1">
                    <v-btn width="100" color="warning">Draft</v-btn>
                    <v-btn width="100">Complete</v-btn>
                </v-row>
            </v-col>
            <v-col cols="3">
                <v-row col="12" class="justify-end mr-1">
                    <v-btn color="warning">Delete Quotation</v-btn>
                </v-row>
            </v-col>
        </v-row>

        <!--  page   -->
        <app-material-card
                color="warning"
                icon="mdi-note"
                :title="'Quotation ' + quotationId"
                subtitle="Client"
                class="px-5 py-3">


            <div class="px-md-16">
                <!-- quotation header     -->
                <v-col col="12">
                    <v-row>
                        <v-col>
                            <div class="text-caption font-weight-bold">Quotation #</div>
                            <div class="text-subtitle-1" v-text="quotation.id"></div>
                        </v-col>
                        <v-col>
                            <div class="text-caption font-weight-bold">Client</div>
                            <div class="text-subtitle-1" v-text="quotation.client"></div>
                        </v-col>
                        <v-col>
                            <div class="text-caption font-weight-bold">Prepared By</div>
                            <div class="text-subtitle-1" v-text="quotation.user"></div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <div class="text-caption font-weight-bold">Created</div>
                            <div class="text-subtitle-1" v-text="quotation.created"></div>
                        </v-col>
                        <v-col>
                            <div class="text-caption font-weight-bold">Modified</div>
                            <div class="text-subtitle-1" v-text="quotation.updated"></div>
                        </v-col>
                        <v-col>
                            <div class="text-caption font-weight-bold"></div>
                            <div class="text-subtitle-1"></div>
                        </v-col>
                    </v-row>
                </v-col>


                <hr class="my-3">

                <v-row col="12" class="justify-end align-center">
                    <v-btn @click="addLineItem()" color="warning">Add Line Item</v-btn>
                </v-row>

                <hr class="my-3">

                <!-- quotation line items -->
                <v-simple-table>
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
                            <td>{{ (item.discounted ? item.discount : '0') | currency('R',2 ) }}</td>
                            <td>{{ item.cost | currency('R',2) }}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Sub Total</td>
                            <td></td>
                            <td></td>
                            <td class="font-weight-bold red--text">-{{ discountTotal | currency('R', 2) }}</td>
                            <td class="font-weight-bold">{{ total | currency('R') }}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Discount</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="font-weight-bold red--text">-{{ quotationDiscount | currency('R', 2) }}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Total</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="font-weight-bold">{{ ((total - discountTotal) - quotationDiscount) | currency('R', 2)
                                }}
                            </td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </div>

        </app-material-card>

    </v-container>
</template>

<script lang="ts">
    import {Component, Mixins, Vue, Watch} from "vue-property-decorator";
    import AppEditor from "@/components/layouts/AppManager.vue";
    import {LineItem, Quotation, Client, User} from '@/models';
    import {PRODUCT, WORKER} from "@/models/LineItem";
    import Vue2Filters from 'vue2-filters'

    @Component({
        components: {}
    })
    export default class QuotationEditor extends Mixins(Vue2Filters.mixin) {
        name = "QuotationEditor"
        quotationId = ""
        quotation = new Quotation();
        quotationDiscount = 10
        lineItems: any[] = [];

        mounted() {
            this.quotationId = this.$route.params.id;

            this.getDemoData()
            this.getQuotation();
        }

        getQuotation() {
            this.quotation = new Quotation();
            this.quotation.id = "1";
            this.quotation.user = "Admin";
            this.quotation.client = "Test Client";
            this.quotation.items = this.lineItems
            this.quotation.total = 9000;
            this.quotation.completed = false;
            this.quotation.created = new Date().toLocaleString()
            this.quotation.updated = new Date().toLocaleString();
        }

        addLineItem() {
            console.log("open modal")
        }

        get discountTotal() {
            return 12;
        }

        get total() {
            return this.lineItems.reduce((total, curr) => {
                return total + (Number.parseFloat(curr.cost) * curr.quantity);
            }, 0)
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

<style lang="scss" scoped>

</style>

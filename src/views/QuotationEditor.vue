<template>
    <v-container :id="name" fluid tag="section" class="my-5">
        <app-material-card
                color="warning"
                icon="mdi-note"
                :title="'Quotation ' + quotationId"
                class="px-5 py-3">

            <!-- quotation header     -->
            <v-col col="12">
                <v-row>
                    <v-col>
                        <div class="text-caption font-weight-bold">Quotation #</div>
                        <div class="text-subtitle-1" v-text="$route.params.id"></div>
                    </v-col>
                    <v-col>
                        <div class="text-caption font-weight-bold">Client</div>
                        <div class="text-subtitle-1" v-text="$route.params.id"></div>
                    </v-col>
                    <v-col>
                        <div class="text-caption font-weight-bold">Prepared By</div>
                        <div class="text-subtitle-1" v-text="$route.params.id"></div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <div class="text-caption font-weight-bold">Date</div>
                        <div class="text-subtitle-1" v-text="$route.params.id"></div>
                    </v-col>
                    <v-col>
                        <div class="text-caption font-weight-bold">Modified</div>
                        <div class="text-subtitle-1" v-text="$route.params.id"></div>
                    </v-col>
                    <v-col>
                        <div class="text-caption font-weight-bold">Created</div>
                        <div class="text-subtitle-1" v-text="$route.params.id"></div>
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
                    <tr v-for="(item, index) in lineItems" :key="item.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>R {{ item.discounted ? item.discount : '0' }}</td>
                        <td>R {{ item.cost }}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Total</td>
                        <td></td>
                        <td></td>
                        <td class="font-weight-bold">R TOTAL_DISCOUNT</td>
                        <td class="font-weight-bold">R SUB_TOTAL</td>
                    </tr>
                    </tbody>
                </template>
            </v-simple-table>


        </app-material-card>

    </v-container>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator";
    import AppEditor from "@/components/layouts/AppManager.vue";
    import {LineItem, Quotation, Client, User} from '@/models';
    import {PRODUCT, WORKER} from "@/models/LineItem";

    @Component({
        components: {}
    })
    export default class QuotationEditor extends Vue {
        name = "QuotationEditor"
        quotationId = ""
        quotation: Quotation | undefined;
        lineItems: any[] = [];

        mounted() {
            this.quotationId = this.$route.params.id;
            this.getQuotation();
            this.getDemoData();
        }

        @Watch('quotation')
        getQuotation() {
            console.log(this.quotationId)
        }

        addLineItem() {
            console.log("open modal")
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
                console.log(typeof lineItem.cost)
                // lineItem.cost = Number(Number(lineItem.cost) * Number(lineItem.quantity));

                this.lineItems.push(lineItem);
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>

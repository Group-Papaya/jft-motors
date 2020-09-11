<template>
    <v-dialog v-model="dialog" v-if="dialog" max-width="600">
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
            <v-card-actions class="justify-center align-center">
                <v-btn color="warning" @click="handleInput(item)">
                    {{ add ? "Add" : "Update" }} Line Item
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import VFormBase from "../../../node_modules/vuetify-form-base/dist/src/vFormBase.vue";
    import LineItem from "@/models/LineItem";

    export default {
        name: "AppAddLineItemToQuotation",
        components: {
            VFormBase
        },
        props: {
            quotation: {
                type: Object,
                default: undefined
            },
            addHandler: {
                type: Function
            },
            editHandler: {
                type: Function
            }
        },
        data() {
            return {
                dialog: false,
                lineItems: this.$store.state.records.lineitems,
                schema: {
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
                },
                rowAttribute: {justify: "center", align: "center", noGutters: true},
                item: {
                    id: "",
                    cost: 0,
                    name: "",
                    type: "",
                    units: 0,
                    quantity: 0,
                    details: "",
                    discounted: false,
                    path: ""
                },
                add: false
            };
        },
        methods: {
            showDialog(add, item = undefined) {
                this.dialog = true;
                this.add = add;

                if (item) this.item = item;
            },
            handleInput(value) {
                if (this.add) {
                    this.addHandler(value);
                } else {
                    this.editHandler(value);
                }

                this.dialog = false
            }
        },
        watch: {
            dialog(newVal) {
                if (!newVal) {
                    this.item = {}
                }
            }
        }
    };
</script>

<style scoped></style>

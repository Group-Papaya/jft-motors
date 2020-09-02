<template>
    <v-card outlined hover>
        <v-card-text class="py-0">
            <v-row>
                <v-col cols="1" class="text-left">
                    <v-chip color="warning" class="px-2" small>#{{position + 1}}</v-chip>
                </v-col>
                <v-col cols="3" class="text-left " v-text="item.name"></v-col>
                <v-col cols="1" class="text-right " v-text="item.quantity"></v-col>
                <v-col cols="2" class="text-right ">{{(item.discounted ? item.discount : "0") | currency("R", 2)}}
                </v-col>
                <v-col cols="3" class="text-right ">{{item.cost | currency("R", 2)}}</v-col>
                <v-col cols="2" class="text-right">
                    <v-icon small class="mr-2" @click.stop="editLineItem(item)">mdi-pencil</v-icon>
                    <v-icon small class="mr-2" @click.stop="deleteLineItem(item)">mdi-delete</v-icon>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
    import {Component, Mixins, Prop, Vue, Watch} from "vue-property-decorator";
    import {LineItem, Quotation, Client, User} from "@/models";

    @Component
    export default class AppQuotationItem extends Vue {
        name = "AppQuotationItem"

        @Prop({type: Object, default: undefined}) readonly item:
            | LineItem
            | undefined;

        @Prop({type: Number, default: undefined}) readonly position:
            | number
            | undefined;


        editLineItem(item: LineItem) {
            this.$emit("edit-line-item", false, item);
        }

        deleteLineItem(item: LineItem) {
            this.$emit("delete-line-item", item);
        }
    }
</script>

<style scoped>

</style>

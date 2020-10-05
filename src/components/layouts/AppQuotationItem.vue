<template>
  <v-card outlined hover>
    <v-card-text class="py-0">
      <v-row>
        <v-col cols="1" class="text-left">
          <v-chip :color="color" class="px-2" small>#{{ position + 1 }}</v-chip>
        </v-col>
        <v-col cols="3" class="text-left" v-text="item.name"></v-col>
        <v-col cols="1" class="text-right" v-text="item.quantity"></v-col>
        <v-col cols="2" class="text-right">
          {{ item.discount ? item.discount : "-" }}
        </v-col>
        <v-col :cols="isEditable ? '3' : '5'" class="text-right">
          {{ item.format }}
        </v-col>
        <v-col cols="2" class="text-right" v-if="isEditable">
          <v-icon small class="mr-2" @click.stop="editLineItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small class="mr-2" @click.stop="deleteLineItem(item)">
            mdi-delete
          </v-icon>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { LineItem } from "@/models";

@Component
export default class AppQuotationItem extends Vue {
  name = "AppQuotationItem";

  @Prop({ type: Object, default: undefined }) readonly item:
    | LineItem
    | undefined;

  @Prop({ type: Number, default: undefined }) readonly position:
    | number
    | undefined;

  @Prop({ type: String, default: "warning" }) readonly color:
    | string
    | undefined;

  editLineItem(item: LineItem) {
    this.$emit("edit-line-item", "lineItemDialog", false, item);
  }

  deleteLineItem(item: LineItem) {
    this.$emit("delete-line-item", item);
  }

  get isEditable() {
    return this.color === "warning";
  }

  @Watch("item")
  setItem(newValue: any) {
    console.log(newValue);
  }
}
</script>

<style scoped></style>

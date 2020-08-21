<template>
  <v-card v-bind="$attrs" :class="classes" class="v-card--material pa-3">
    <div class="d-flex grow flex-wrap">
      <v-avatar
        v-if="avatar"
        size="128"
        class="mx-auto v-card--material__avatar elevation-6"
        color="grey"
      >
        <v-img :src="avatar" />
      </v-avatar>

      <v-sheet
        v-else
        :class="{
          'pa-7': !$slots.image
        }"
        :color="color"
        :max-height="icon ? 90 : undefined"
        width="auto"
        elevation="6"
        class="text-start v-card--material__heading mb-n6"
        dark
      >
        <slot v-if="$slots.heading" name="heading" />

        <slot v-else-if="$slots.image" name="image" />

        <div
          v-else-if="title && !icon"
          class="display-1 font-weight-light"
          v-text="title"
        />
        <div
          v-if="subtitle"
          class="subtitle-1 font-weight-light"
          v-text="subtitle"
        ></div>

        <v-icon v-else-if="icon" size="32" v-text="icon" />

        <div v-if="text" class="headline font-weight-thin" v-text="text" />
      </v-sheet>

      <div v-if="button" class="ml-6 flex-fill">
        <v-row class="mr-2">
          <div
            v-if="!subtitle"
            class="card-title font-weight-light"
            v-text="title"
          />

          <div class="ml-auto text-right">
            <v-btn
              fab
              top
              right
              x-small
              color="warning"
              @click="addItem(title)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <span class="card-title  ml-2 hidden-sm-and-down font-weight-light"
              >Add {{ itemName }}</span
            >
          </div>
        </v-row>
      </div>

      <div v-else-if="icon && title" class="ml-4">
        <div class="card-title font-weight-light" v-text="title" />
      </div>
    </div>

    <slot />

    <!--  action buttons -->
    <template v-if="$slots.actions">
      <v-divider class="mt-2" />
      <v-card-actions class="pb-0">
        <slot name="actions" />
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
import { VCard } from "vuetify/lib";

export default {
  name: "MaterialCard",

  props: {
    ...VCard,
    avatar: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "success"
    },
    icon: {
      type: String,
      default: undefined
    },
    image: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    subtitle: {
      type: String,
      default: ""
    },
    button: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    addItem: function() {
      this.$emit("openDialog", true);
    }
  },
  computed: {
    classes() {
      return {
        "v-card--material--has-heading": this.hasHeading
      };
    },
    hasHeading() {
      return Boolean(this.$slots.heading || this.title || this.icon);
    },
    hasAltHeading() {
      return Boolean(this.$slots.heading || (this.title && this.icon));
    },
    itemName() {
      return this.title.slice(0, this.title.length - 1);
    }
  }
};
</script>

<style lang="sass">
.v-card--material
    &__avatar
        position: relative
        top: -64px
        margin-bottom: -32px

    &__heading
        position: relative
        top: -40px
        transition: .3s ease
        z-index: 1
</style>

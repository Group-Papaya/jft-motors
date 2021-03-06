<template>
  <v-navigation-drawer
    id="app-navigation-drawer"
    v-model="drawer"
    :dark="true"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    mobile-breakpoint="960"
    app
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img v-bind="props" />
    </template>

    <v-divider class="mb-1" />

    <v-list dense nav>
      <v-list-item>
        <v-list-item-title>
          <v-row align="center" justify="center">
            <v-img :src="logo" max-width="180" />
          </v-row>
        </v-list-item-title>

        <v-list-item-content>
          <v-list-item-title class="display-1" v-text="profile.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />

    <v-list expand nav>
      <div />

      <template v-for="(item, i) in computedItems">
        <app-item-group v-if="item.children" :key="`group-${i}`" :item="item" />

        <app-item v-else :key="`item-${i}`" :item="item" />
      </template>

      <div />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import logo from "@/assets/logo.png";
import { BASE_ROLE } from "@/models/User";

export default {
  name: "AppDrawer",

  props: {
    expandOnHover: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    items: [
      {
        title: "Dashboard",
        icon: "mdi-view-dashboard",
        to: "/"
      },
      {
        title: "Quotations",
        icon: "mdi-note",
        to: "/quotations"
      },
      {
        title: "Invoices",
        icon: "mdi-note-text",
        to: "/invoices"
      },
      {
        title: "Line Items",
        icon: "mdi-format-list-bulleted",
        to: "/line-items"
      },
      {
        title: "Clients",
        icon: "mdi-account-box-outline",
        to: "/clients"
      },
      {
        title: "Reports",
        icon: "mdi-chart-bar",
        to: "/reports"
      }
    ],
    logo: logo
  }),

  computed: {
    ...mapState(["barColor"]),
    ...mapGetters(["discounts"]),
    ...mapGetters(["currentUser"]),
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      }
    },
    computedItems() {
      const items = [
        this.discounts.allowed
          ? {
              title: "Discounts",
              icon: "mdi-tag-text-outline",
              to: "/discounts"
            }
          : null,
        this.authMenu
          ? {
              title: "Users",
              icon: "mdi-account-multiple",
              to: "/users"
            }
          : null
      ].filter(item => item !== null);

      return this.items.concat(items).map(this.mapItem);
    },
    authMenu() {
      return this.currentUser.role !== BASE_ROLE;
    },
    profile() {
      return {
        avatar: true
      };
    }
  },

  methods: {
    mapItem(item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined
      };
    }
  }
};
</script>

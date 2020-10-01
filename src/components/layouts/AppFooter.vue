<template>
  <v-footer id="app-footer" fixed class="hidden-sm-and-down" v-if="showFooter">
    <v-container>
      <v-row align="center" no-gutters>
        <v-spacer class="hidden-sm-and-down" />

        <v-col cols="12" md="auto">
          <div class="body-1 font-weight-light pt-6 pt-md-0 text-center">
            &copy; 2020, jft motors
            <v-icon size="18">
              mdi-car-sports
            </v-icon>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class AppFooter extends Vue {
  name = "AppFooter";
  showFooter = true;

  @Watch("$route")
  setCurrentRoute(newRoute: any) {
    if (newRoute.path.split("/").length >= 3) {
      this.showFooter = false;
    } else {
      this.showFooter = true;
    }
  }
}
</script>

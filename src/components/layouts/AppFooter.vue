<template>
  <v-footer id="app-footer">
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

<script>
export default {
  name: "AppFooter"
};
</script>

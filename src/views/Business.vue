<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12">
        <v-card class="mx-auto" max-width="600">
          <div style="display: flex">
            <v-img class="white--text align-end" width="45%" :src="business" />
            <v-img class="white--text align-end" width="45%" :src="services" />
          </div>
          <v-card-subtitle class="pb-0">Role: {{ user.role }}</v-card-subtitle>

          <v-card-text class="text--primary">
            <div data-cy="user-full-name">
              {{ `${user.firstname} ${user.lastname}` }}
            </div>
          </v-card-text>

          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Edit Profile
            </div>

            <div class="subtitle-1 font-weight-light">
              Complete your profile
            </div>
          </template>

          <v-form>
            <v-container>
              <v-row class="px-3">
                <v-col cols="12" md="6">
                  <v-text-field
                    filled
                    readonly
                    value="JFT Motors"
                    label="Company (name)"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    filled
                    readonly
                    :value="user.email"
                    label="Email Address"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    label="First Name"
                    class="purple-input"
                    :value="user.firstname"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    label="Last Name"
                    class="purple-input"
                    :value="user.lastname"
                  />
                </v-col>

                <v-col cols="12" class="mb-n6">
                  <v-banner class="mb-2" icon="mdi-map" single-line sticky>
                    Business Address
                  </v-banner>
                  <v-text-field
                    label="Address"
                    class="purple-input"
                    :value="details.address.street"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="City"
                    class="purple-input"
                    :value="details.address.city"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="Country"
                    class="purple-input"
                    :value="details.address.country"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    class="purple-input"
                    label="Postal Code"
                    type="number"
                    :value="details.address.zipcode"
                  />
                </v-col>

                <v-col cols="12">
                  <v-banner
                    sticky
                    single-line
                    class="mb-2"
                    icon="mdi-notebook-edit"
                  >
                    Settings / Rules
                  </v-banner>
                  <v-row>
                    <v-col cols="12">
                      <h3>Total Discount</h3>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        type="number"
                        label="Rand amount"
                        class="purple-input"
                        :value="discounts.rands"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        type="number"
                        label="Percentage"
                        class="purple-input"
                        :value="discounts.percentage"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-switch
                        inset
                        label="Allow Discounts"
                        :value="discounts.allowed"
                      />
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" class="text-right">
                  <v-btn color="success" class="mr-0">
                    Update Settings
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppEditor from "@/components/layouts/AppManager.vue";
import User, { ROLES } from "@/models/User";

@Component({
  components: { AppEditor }
})
export default class UserProfile extends Vue {
  get user(): User {
    return this.$store.state.auth.user;
  }

  get roles() {
    return ROLES;
  }

  get details() {
    return this.$store.state.details;
  }

  get discounts() {
    return {
      rands: 150,
      allowed: false,
      percentage: 15
    };
  }

  set discounts(obj) {
    console.log(obj);
  }

  get business() {
    return require("@/assets/business.jpg");
  }

  get services() {
    return require("@/assets/business-services.jpg");
  }
}
</script>

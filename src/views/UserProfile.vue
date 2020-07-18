<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Edit Profile
            </div>

            <div class="subtitle-1 font-weight-light">
              Complete your profile
            </div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field label="Company (disabled)" disabled />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field class="purple-input" label="User Name" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field label="Email Address" class="purple-input" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="First Name" class="purple-input" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="Last Name" class="purple-input" />
                </v-col>

                <v-col cols="12">
                  <v-text-field label="Adress" class="purple-input" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field label="City" class="purple-input" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field label="Country" class="purple-input" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    class="purple-input"
                    label="Postal Code"
                    type="number"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea class="purple-input" label="About Me" />
                </v-col>

                <v-col cols="12" class="text-right">
                  <v-btn color="success" class="mr-0">
                    Update Profile
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="mx-auto" max-width="400">
          <v-img
            class="white--text align-end"
            width="100%"
            src="http://www.jftmotors.co.za/skin/images/banner_img01.jpg"
          />

          <v-card-subtitle class="pb-0">Admin</v-card-subtitle>

          <v-card-text class="text--primary">
            <div>Alex Johnson</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<template>
  <v-container id="forgotPassword" fluid tag="section">
    <app-material-card
      icon="mdi-account"
      title="Reset Password"
      class="px-5 py-3 col-8 mx-auto mt-3"
    >
      <v-row class="px-5">
        <v-col class="col-12">
          <v-text-field
            v-model="form.email"
            label="Email"
            class="purple-input"
          />
        </v-col>

        <v-col class="col-12 text-center">
          <v-btn @click="resetPassword()" color="success" class="mr-0"
            >Reset Password</v-btn
          >
        </v-col>
        {{ error }}
      </v-row>
    </app-material-card>
  </v-container>
</template>
<script>
import { auth } from "@/services/auth.service";

export default {
  name: "Register",
  data() {
    return {
      form: {
        email: ""
      },
      error: null
    };
  },
  methods: {
    resetPassword() {
      auth.resetPassword(this.form.email);
    }
  }
};
</script>

<style lang="css">
#forgotPassword {
  position: relative;
  margin-top: 250px;
  margin-left: 500px;
  width: 800px;
}
</style>

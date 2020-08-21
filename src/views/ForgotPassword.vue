<template>
  <v-container id="auth-layout" fluid tag="section">
    <app-material-card
      icon="mdi-account"
      title="Forgot Password"
      class="mx-auto"
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

<style>
#auth-layout {
  max-width: 480px;
  min-width: 300px;
  margin-top: 10%;
}
</style>

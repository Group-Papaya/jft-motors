<template>
  <app-auth
    title="Forgot Password"
    :form-error="error"
    :form-submit="resetPassword"
    button-text="Reset Password"
  >
    <v-col class="col-12">
      <v-text-field
        required
        type="email"
        label="Email"
        class="purple-input"
        :rules="rules.email"
        v-model="form.email"
        @focusin="error = null"
      />
    </v-col>
  </app-auth>
</template>
<script>
import { auth } from "@/services/auth.service";
import AppAuth from "@/components/layouts/AppAuth";

export default {
  name: "Register",
  components: { AppAuth },
  data() {
    return {
      form: {
        email: ""
      },
      rules: {
        email: [
          v => !!v || "E-mail is required",
          v => /.+@.+\..+/.test(v) || "E-mail must be valid"
        ]
      },
      error: null
    };
  },
  methods: {
    async resetPassword() {
      await auth.resetPassword(this.form.email).then(value => {
        if (value.error) this.error = value.error.message;
      });
    }
  }
};
</script>

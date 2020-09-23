<template>
  <app-auth
    :form-error="error"
    :form-submit="reset"
    title="Forgot Password"
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
    async reset() {
      await auth.resetPassword(this.form.email).then(value => {
        if (value.error) this.error = value.error.message;
        else {
          this.$toast.success(`Email Sent to: ${this.form.email}`);
          if (this.$store.getters.isAuthenticated) this.$router.replace("/");
          else this.$router.replace({ name: "Login" });
        }
      });
    }
  }
};
</script>

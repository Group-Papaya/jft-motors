<template>
  <app-auth title="Login" :form-submit="loginUser" :form-error="error">
    <v-col class="col-12">
      <v-text-field
        required
        type="email"
        label="Email"
        class="purple-input"
        @focusin="error = null"
        :rules="rules.email"
        v-model="form.email"
      />
    </v-col>

    <v-col class="col-12">
      <v-text-field
        required
        type="password"
        label="Password"
        class="purple-input"
        @focusin="error = null"
        :rules="rules.password"
        v-model="form.password"
      />
    </v-col>
    <v-col class="col-12">
      <p class="text-center">
        Forgot your password?
        <router-link :to="{ path: 'forgot-password' }"
          >Click here to reset
        </router-link>
      </p>
      <p v-if="!this.$store.state.registered" class="text-center">
        <router-link :to="{ path: 'register' }">
          Setup business
        </router-link>
      </p>
    </v-col>
  </app-auth>
</template>
<script>
import AppAuth from "@/components/layouts/AppAuth";
import { auth } from "@/services/auth.service";

export default {
  components: {
    AppAuth
  },
  name: "Register",
  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      rules: {
        email: [
          v => !!v || "E-mail is required",
          v => /.+@.+\..+/.test(v) || "E-mail must be valid"
        ],
        password: [
          v => !!v || "Password is required",
          v =>
            (v && v.length >= 8) || "Password must be greater than 8 characters"
        ]
      },
      error: null
    };
  },
  methods: {
    async loginUser() {
      await auth.login(this.form.email, this.form.password).then(value => {
        if (value.error) this.error = value.error.message;
        else this.$router.replace("/");
      });
    }
  }
};
</script>

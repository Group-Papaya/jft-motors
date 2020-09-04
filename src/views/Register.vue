<template>
  <app-auth title="Register" :form-submit="register" :form-error="error">
    <v-col class="col-12">
      <v-text-field
        required
        type="text"
        :rules="[v => !!v || `Firstname is required`]"
        label="Firstname"
        class="purple-input"
        v-model="form.firstname"
      />

      <v-text-field
        required
        type="text"
        label="Lastname"
        :rules="[v => !!v || `Lastname is required`]"
        class="purple-input"
        v-model="form.lastname"
      />
    </v-col>
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

    <v-col class="col-12">
      <v-text-field
        required
        type="password"
        label="Password"
        class="purple-input"
        :rules="rules.password"
        v-model="form.password"
        @focusin="error = null"
      />
    </v-col>

    <v-col class="col-12">
      <p class="text-center">
        Already have an account?
        <router-link :to="{ path: 'login' }">Click here to log in</router-link>
      </p>
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
        email: "",
        password: "",
        firstname: "",
        lastname: ""
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
    async register() {
      await auth.register(this.form).then(value => {
        if (value.error) this.error = value.error;
        else this.$router.replace("/auth/login");
      });
    }
  }
};
</script>

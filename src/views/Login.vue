<template>
  <v-container id="auth-layout" fluid tag="section">
    <app-material-card icon="mdi-account" title="Login" class="mx-auto">
      <v-row class="px-5">
        <v-col class="col-12">
          <v-text-field
            v-model="form.email"
            label="Email"
            class="purple-input"
          />
        </v-col>

        <v-col class="col-12">
          <v-text-field
            v-model="form.password"
            type="password"
            label="Password"
            class="purple-input"
          />
        </v-col>
        <v-col class="col-12">
          <p class="text-center">
            Forgot your password?
            <a>Click here to reset</a>
          </p>
        </v-col>
        <v-col class="col-12 text-center">
          <v-btn @click="loginUser()" color="success" class="mr-0">Login</v-btn>
        </v-col>
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
        email: "",
        password: ""
      },
      error: null
    };
  },
  methods: {
    loginUser() {
      auth
        .login(this.form.email, this.form.password)
        .then(() => {
          this.$router.replace("/");
        })
        .catch(err => {
          this.error = err;
          console.log(err.message);
        });
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

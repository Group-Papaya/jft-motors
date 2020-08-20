<template>
  <v-container id="auth-layout" fluid tag="section">
    <app-material-card icon="mdi-account" title="Register" class="mx-auto">
      <v-row class="px-5">
        <v-col class="col-12">
          <v-text-field
            v-model="form.firstname"
            label="First Name"
            class="purple-input"
          />

          <v-text-field
            v-model="form.lastname"
            label="Last Name"
            class="purple-input"
          />
        </v-col>
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
            Already have an account?
            <a>Click here to log in</a>
          </p>
        </v-col>

        <v-col class="col-12 text-center">
          <v-btn color="success" class="mr-0" @click="register(form)"
            >Register</v-btn
          >
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
        password: "",
        firstname: "",
        lastname: ""
      },
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters"
      }
    };
  },
  methods: {
    register: async form => {
      await auth.register(form.email, form.password);
      //  this.$router.replace("/");
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

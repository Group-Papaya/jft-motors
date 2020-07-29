<template>
  <v-container id="register" fluid tag="section">
    <app-material-card icon="mdi-account" title="Register" class="px-5 py-3 col-8">
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
            label="Password"
            class="purple-input"
          />
        </v-col>

        <v-col class="col-12">
          <p class="text-right">
            Already have an account?
            <a>Click here to log in</a>
          </p>
        </v-col>

        <v-col class="col-12 text-center">
          <v-btn color="success" class="mr-0">Register</v-btn>
        </v-col>
      </v-row>
    </app-material-card>
  </v-container>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      form: {
        firstname: "",
        email: "",
        password: "",
      },
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
      },
    };
  },
};
</script>

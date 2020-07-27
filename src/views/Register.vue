<template>
  <v-container id="login" fluid tag="section">
    <app-material-card icon="mdi-account" title="Login" class="px-5 py-3">
      <v-row class="px-5">
        <v-col class="col-12">
          <v-text-field label="Email" class="purple-input" />
        </v-col>

        <v-col class="col-12">
          <v-text-field
            v-model="password"
            label="Password"
            class="purple-input"
          />
        </v-col>

        <v-col class="col-12">
          <p class="text-right">
            Forgot your password?
            <a>Click here to reset</a>
          </p>
        </v-col>

        <v-col class="col-12 text-center">
          <v-btn color="success" class="mr-0">Login</v-btn>
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
      email: "",
      password: "",
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
      },
    };
  },
};
</script>

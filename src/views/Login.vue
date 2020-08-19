<template>
  <v-container id="login" fluid tag="section">
    <app-material-card icon="mdi-account" title="Login" class="px-5 py-3 col-8">
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
            Forgot your password?
            <a>Click here to reset</a>
          </p>
        </v-col>
        <v-col class="col-12 text-center">
          <v-btn @click="loginUser()" color="success" class="mr-0">Login</v-btn>
        </v-col>
        {{ error }}
        <!-- <div v-if="error">{{ error.message }}</div> -->
      </v-row>
    </app-material-card>
  </v-container>
</template>
<script>
export default {
  name: "Register"
};
</script>

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
          <p class="text-center">
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
import AuthService from "@/services/auth.service";

const authService = new AuthService();
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
      authService
        .login(this.form.email, this.form.password)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then(res => {
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

<style lang="css">
#login {
  position: relative;
  margin-top: 150px;
  margin-left: 500px;
  width: 800px;
}
</style>

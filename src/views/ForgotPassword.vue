<template>
  <v-container id="forgotPassword" fluid tag="section">
    <app-material-card
      icon="mdi-account"
      title="Password Reset"
      class="px-5 py-3 col-8"
    >
      <v-row class="px-5">
        <v-col class="col-12">
          <v-text-field
            v-model="form.email"
            label="Email"
            class="purple-input"
          />
        </v-col>

        <v-col class="col-12 text-center">
          <v-btn @click="resetUser()" color="success" class="mr-0"
            >Reset Password</v-btn
          >
        </v-col>
        {{ error }}
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
        password: "123456"
      },
      error: null
    };
  },
  methods: {
    loginUser() {
      authService
        .login(this.form.email, this.form.password)
        .then(res => {
          console.log(res);
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
#forgotPassword {
  position: relative;
  margin-top: 250px;
  margin-left: 500px;
  width: 800px;
}
</style>

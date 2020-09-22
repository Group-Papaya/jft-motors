<template>
  <app-auth
    :valid="valid"
    :form-error="error"
    :form-submit="submitDetails"
    button-text="Submit Details"
    title="Setup Your Business Account"
  >
    <v-col v-if="valid">
      <v-col class="col-12">
        <v-text-field
          required
          type="text"
          :rules="[v => !!v || `Company name is required`]"
          label="Company Name"
          class="purple-input"
          v-model="form.company"
        />

        <v-text-field
          required
          type="text"
          label="Phone number"
          class="purple-input"
          :rules="rules.telephone"
          v-model="form.telephone"
        />
      </v-col>
      <v-col class="col-12">
        <v-textarea
          required
          type="text"
          label="Business Address"
          placeholder="105 Main Road, Green Point, Cape Town, 8005, South Africa"
          class="purple-input"
          :rules="rules.address"
          v-model="form.address"
        />
      </v-col>
    </v-col>
    <v-col v-if="!valid" class="col-12">
      <p class="text-center">
        Sign In to Continue<br />
        <img
          @click="login()"
          alt="Google Logo"
          class="social-button"
          src="../assets/google-logo.png"
        />
      </p>
    </v-col>
  </app-auth>
</template>

<script>
import { auth } from "@/services/auth.service";
import AppAuth from "@/components/layouts/AppAuth";
import { MANAGER_ROLE } from "@/models/User";
import { db } from "@/firebase";

export default {
  name: "Register",
  components: { AppAuth },
  data() {
    return {
      valid: false,
      form: {
        company: "",
        address: "",
        telephone: ""
      },
      rules: {
        address: [
          v => !!v || "Business Address is required",
          v =>
            /^([\d]{0,5})(([\w\s]*,){2,3})(\s[\d]{4},)(.)(South Africa)/gm.test(
              v
            ) ||
            "Address should have: Street Address, Suburb, City, Postal Code, South Africa"
        ],
        telephone: [
          v => !!v || "Phone number is required",
          v =>
            (v && v.length >= 10) ||
            "Please supply a valid South African Phone number"
        ]
      },
      error: null
    };
  },
  methods: {
    async login() {
      await auth.socialLogin(MANAGER_ROLE).then(value => {
        if (value.result) {
          this.valid = true;
          this.$toast.success("Logged in with Google");
        } else this.$toast.error("Failed to use Google");
      });
    },
    async submitDetails() {
      const { address, telephone, company } = this.form;
      const details = address.split(",").map(it => it.trim());
      const last = details.length - 1;
      const newAddress = {
        city: details[last - 2],
        street: details[0],
        suburb: last === 4 ? details[1] : null,
        zipcode: details[last - 1],
        country: details[last]
      };
      await db
        .collection("/settings")
        .doc("business-details")
        .set({ address: newAddress, telephone, company })
        .then(() => this.$router.replace("/"));
    }
  }
};
</script>
<style>
.social-button {
  cursor: pointer;
  max-width: 48px;
  border-radius: 100%;
  border: 1px solid white;
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.25);
}
</style>

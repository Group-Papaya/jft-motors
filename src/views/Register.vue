<template>
  <app-auth
    :valid="valid"
    :form-error="error"
    :form-submit="submitDetails"
    button-text="Submit Details"
    title="Setup Your Business Account"
  >
    <v-col class="mt-n6" v-if="valid">
      <v-col class="col-12 mb-n3">
        <v-row>
          <v-col cols="6">
            <v-text-field
              required
              :disabled="disabled.firstname"
              type="text"
              :rules="[v => !!v || `Your name is required`]"
              label="Firstname"
              class="purple-input"
              v-model="form.firstname"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              :disabled="disabled.lastname"
              required
              type="text"
              label="Lastname"
              class="purple-input"
              :rules="[v => !!v || `Your Lastname is required`]"
              v-model="form.lastname"
            />
          </v-col>
          <v-col class="col-12 mt-n6">
            <v-text-field
              :disabled="disabled.email"
              required
              type="text"
              :rules="[v => !!v || `Your Email is required`]"
              label="Email"
              class="purple-input"
              v-model="form.email"
            />
          </v-col>
        </v-row>
      </v-col>

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
          alt="Google Logo"
          class="social-button"
          @click="login(form, disabled)"
          src="../assets/google-logo.png"
        />
      </p>
    </v-col>
  </app-auth>
</template>

<script>
import { auth } from "@/services/auth.service";
import AppAuth from "@/components/layouts/AppAuth";
import { db } from "@/firebase";
import { MANAGER_ROLE } from "@/models/User";

export default {
  name: "Register",
  components: { AppAuth },
  data() {
    return {
      valid: false,
      disabled: {
        email: false,
        firstname: false,
        lastname: false
      },
      form: {
        email: "",
        company: "",
        address: "",
        telephone: "",
        lastname: "",
        firstname: ""
      },
      rules: {
        address: [
          v => !!v || "Business Address is required",
          v =>
            /^([\d]{0,5})(([\w\s]*,){2,3})(\s[\d]{4},)(.)(South Africa)$/gm.test(
              v
            ) ||
            "Address should have: Street Address, Suburb, City, Postal Code, South Africa"
        ],
        telephone: [
          v => !!v || "Phone number is required",
          v =>
            /^((?:\+27|27)|0)(\d{2})[- ]?(\d{3})[- ]?(\d{4})$/gm.test(v) ||
            "Please supply a valid South African Phone number"
        ]
      },
      error: null
    };
  },
  methods: {
    async login(form, disabled) {
      await auth
        .socialLogin(function(credentials) {
          const { user } = credentials;
          const {
            given_name: firstname,
            family_name: lastname
          } = credentials.additionalUserInfo.profile;

          if (firstname && lastname) {
            form.lastname = lastname;
            form.firstname = firstname;
            disabled.firstname = true;
            disabled.lastname = true;
          }

          if (user.email) {
            disabled.email = true;
            form.email = user.email;
          }
        })
        .then(value => {
          if (value.result) {
            this.valid = true;
            this.$toast.success("Logged in with Google");
          } else this.$toast.error("Failed to use Google");
        });
    },
    async submitDetails() {
      const {
        email,
        address,
        company,
        lastname,
        firstname,
        telephone
      } = this.form;
      const details = address.split(",").map(it => it.trim());
      const last = details.length - 1;
      const newAddress = {
        city: details[last - 2],
        street: details[0],
        suburb: last === 4 ? details[1] : null,
        zipcode: details[last - 1],
        country: details[last]
      };

      await auth.register({
        password: "P@ssword1",
        role: MANAGER_ROLE,
        firstname,
        lastname,
        email
      });

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

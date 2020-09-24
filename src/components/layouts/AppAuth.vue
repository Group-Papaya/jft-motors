<template>
  <v-container id="auth-layout" fluid tag="section">
    <app-material-card icon="mdi-account" :title="title" class="mx-auto">
      <v-form
        ref="form"
        lazy-validation
        v-model="formValid"
        @input="formError = null"
        @submit.prevent="formSubmit"
      >
        <v-row class="px-5">
          <slot></slot>
          <v-col class="col-12 text-center">
            <v-btn
              type="submit"
              color="success"
              class="mr-0"
              min-width="100%"
              :disabled="disabled"
              >{{ buttonText ? buttonText : title }}
            </v-btn>
          </v-col>
          <v-col class="col-12 mt-3">
            <v-alert v-if="formError" type="error">
              {{ formError }}
            </v-alert>
          </v-col>
        </v-row>
      </v-form>
    </app-material-card>
  </v-container>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class AppAuth extends Vue {
  private formValid = false;
  @Prop() private title!: string;
  @Prop() private valid!: boolean;
  @Prop() private formError!: string;
  @Prop() private formSubmit!: (any) => void;
  @Prop() private buttonText!: string;

  mounted() {
    this.formValid = false;
  }

  get disabled() {
    return !this.formValid && !this.valid;
  }
}
</script>

<style lang="css">
#auth-layout {
  margin: auto;
  min-width: 300px;
  max-width: 480px;
  padding: 4.8em 1.2em;
}
</style>

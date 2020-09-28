<template>
  <v-overlay z-index="9999999" :value="show">
    <v-progress-circular indeterminate size="150">
      {{ message }}
    </v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  name: "AppOverlay",
  props: {
    show: {
      type: Boolean,
      default: false,
      readonly: true
    }
  },
  data: () => ({
    message: "Working"
  })
};
</script>

<style scoped></style>

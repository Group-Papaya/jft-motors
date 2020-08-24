<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>
        <span class="headline">{{ create ? "Add" : "Edit" }} {{ name }}</span>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-form-base
            :row="rowAttribute"
            :col="12"
            :model="create ? model : item"
            :schema="schema"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn large color="success" @click="handleInput(create ? model : item)"
          >Submit</v-btn
        >
        <v-btn large color="error" @click="dialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="js">
import VFormBase from 'vuetify-form-base'

export default {
    name: "AppManagerDialog",
    components: {VFormBase},
    props: {
        name: {
          type: String,
          default: 'item'
        },
        model: {
            type: Object,
            default: undefined
        },
        schema: {
            type: Object,
            default: undefined
        },
        addHandler: {
            type: Function
        },
      editHandler: {
        type: Function
      }
    },
    data() {
        return {
            rowAttribute: {justify: 'center', align: 'center', noGutters: true},
            dialog: false,
            create: false,
            item: undefined
        }
    },
    methods: {
        showDialog(create, item = undefined) {
            this.dialog = true
            this.create = create
            this.item = item
        },
        handleInput(val) {
          if (this.create) {
            this.addHandler(val)
          } else {
            this.editHandler(val)
          }
           this.dialog = false
        }
    },
}
</script>

<style scoped></style>

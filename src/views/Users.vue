<template>
  <AppEditor
    title="Users"
    :model="model"
    :schema="schema"
    :addHandler="addUser"
    :editHandler="editItem"
    icon="mdi-account-multiple"
    :items="users"
    :headers="headers"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import User, { ADMIN_ROLE, BASE_ROLE, ROLES } from "@/models/User";
import AppEditor from "@/components/layouts/AppManager.vue";
import { dbService } from "@/services/firestore.service";
import curdService, { curd } from "@/services/curd.service";

@Component({
  components: { AppEditor }
})
export default class Users extends Vue {
  headers = [
    {
      sortable: false,
      text: "ID",
      value: "id"
    },
    {
      sortable: false,
      text: "first name",
      value: "firstname"
    },
    {
      sortable: false,
      text: "last name",
      value: "lastname"
    },
    {
      sortable: false,
      text: "phone number",
      value: "phone"
    },
    {
      sortable: false,
      text: "email address",
      value: "email"
    },
    {
      sortable: false,
      text: "role",
      value: "role"
    },
    {
      sortable: false,
      text: "actions",
      value: "actions"
    }
  ];

  get users() {
    return this.$store.state.records.users;
  }

  model = {
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    role: ROLES[ADMIN_ROLE]
  };

  schema = {
    firstname: {
      type: "text",
      label: "First Name"
    },
    lastname: {
      type: "text",
      label: "Last Name"
    },
    phone: {
      type: "text",
      label: "Phone Number"
    },
    email: {
      type: "email",
      label: "Email Address"
    },
    role: {
      type: "select",
      label: "Role",
      items: [ROLES[ADMIN_ROLE], ROLES[BASE_ROLE]]
    }
  };

  created() {
    curdService.watchCollection(
      data => this.$store.commit("SET_RECORDS", { users: data }),
      "users"
    );
  }

  editItem(user: User) {
    this.$store.dispatch("SET_RECORD", { record: user, path: user.path });
  }

  addUser(user: User) {
    this.$store.dispatch("ADD_RECORD", { record: user, path: "users" });
  }
}
</script>

<style scoped></style>

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
import User, { BASE_ROLE, ROLES } from "@/models/User";
import AppEditor from "@/components/layouts/AppManager.vue";

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
      text: "Firstname",
      value: "firstname"
    },
    {
      sortable: false,
      text: "Lastname",
      value: "lastname"
    },
    {
      sortable: false,
      text: "Phone Number",
      value: "phone"
    },
    {
      sortable: false,
      text: "E-mail Address",
      value: "email"
    },
    {
      sortable: false,
      text: "Role",
      value: "role"
    },
    {
      sortable: false,
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
    role: ROLES[BASE_ROLE]
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
      items: ROLES
    }
  };

  editItem(user: User) {
    this.$store.dispatch("SET_RECORD", {
      record: this.mutUser(user),
      path: user.path
    });
  }

  addUser(user: User) {
    this.$store.dispatch("ADD_RECORD", {
      record: this.mutUser(user),
      path: "users"
    });
  }

  mutUser(user: User): User {
    return {
      ...user,
      meta: {
        ...user.meta,
        role: ROLES.indexOf(user.role)
      }
    };
  }
}
</script>

<style scoped></style>

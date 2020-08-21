<template>
  <AppEditor
    title="Users"
    :model="model"
    :schema="schema"
    :addHandler="addUser"
    :editHandler="editItem"
    icon="mdi-account-multiple"
    :items="items"
    :headers="headers"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import User, { ADMIN_ROLE, BASE_ROLE } from "@/models/User";
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

  items: any[] = [];

  model = {
    fistname: "",
    lastname: "",
    phone: "",
    email: "",
    role: ADMIN_ROLE
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
      items: [ADMIN_ROLE, BASE_ROLE]
    }
  };

  mounted() {
    this.getDemoData();
  }

  getDemoData() {
    for (let x = 1; x < 11; x++) {
      const client = {
        id: `${x}`,
        firstname: `user ${x}`,
        lastname: `surname ${x}`,
        phone: x * 1000,
        email: "test@email.com",
        role: x % 2 ? ADMIN_ROLE : BASE_ROLE
      };

      this.items.push(client);
    }
  }

  editItem(user: User) {
    console.log(user);
  }

  addUser(user: User) {
    console.log(user);
  }
}
</script>

<style scoped></style>

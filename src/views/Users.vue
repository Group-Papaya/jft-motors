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
import User, { BASE_ROLE, MANAGER_ROLE, ROLES } from "@/models/User";
import AppEditor from "@/components/layouts/AppManager.vue";
import { auth } from "@/services/auth.service";
import { POSITION } from "vue-toastification";
import { emailVal, phoneVal, required } from "@/utils";

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
    const users = this.$store.state.records.users;
    return users.filter(
      user =>
        user.role !== MANAGER_ROLE &&
        user.id !== this.$store.getters.currentUser.id
    );
  }

  model = {
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    role: BASE_ROLE
  };

  schema = {
    firstname: {
      type: "text",
      label: "First Name",
      rules: [required("Amount is required")]
    },
    lastname: {
      type: "text",
      label: "Last Name",
      rules: [required("Amount is required")]
    },
    phone: {
      type: "text",
      label: "Phone Number",
      rules: [required("Phone numer is required"), phoneVal()]
    },
    email: {
      type: "email",
      label: "Email Address",
      rules: [required("Amount is required"), emailVal()]
    },
    role: {
      type: "select",
      label: "Role",
      items: ROLES.filter(it => it !== MANAGER_ROLE)
    }
  };

  async editItem(user: User) {
    await this.$store.dispatch("SET_RECORD", {
      record: this.mutUser(user),
      path: user.path
    });

    this.$toast.success(`User "${user.email}" updated`);
  }

  addUser(user: User) {
    const appUser: User = this.$store.getters.currentUser;

    if (appUser.role !== BASE_ROLE) {
      auth.register({ ...user, password: "P@ssword1" }).then(() => {
        this.$toast.success(`New account created: ${user.email}`, {
          position: POSITION.TOP_RIGHT
        });
      });
    }
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

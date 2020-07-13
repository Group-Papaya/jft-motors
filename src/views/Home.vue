<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />

    <button>Click me</button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { Collection } from "firebase-firestorm";
import User, { ADMIN_ROLE } from "@/models/User";

const defaulUser = new User();

defaulUser.firstname = "Ian";
defaulUser.lastname = "Mubangizi";
defaulUser.password = "password";
defaulUser.email = "io@ianmubangizi.com";
defaulUser.role = ADMIN_ROLE;

let user;

Collection(User)
  .create(defaulUser)
  .then(_user => {
    if (_user) user = _user;
  });

console.log(user);

export default {
  name: "Home",
  components: {
    HelloWorld
  }
};
</script>

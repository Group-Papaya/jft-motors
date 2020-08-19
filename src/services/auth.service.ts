import { tryCatch } from "@/utils";
import * as firebase from "firebase/app";
import { orLog } from "./../utils";

export default class AuthService {
  user!: firebase.User | null;

  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user;
    });
  }

  authenticated() {
    return this.user && !this.user.isAnonymous;
  }

  @tryCatch(orLog)
  async register(email: string, password: string) {
    return await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
  }

  @tryCatch(orLog)
  async login(email: string, password: string) {
    return await firebase.auth().signInWithEmailAndPassword(email, password);
  }

  @tryCatch(orLog)
  async logout() {
    await firebase.auth().signOut();
  }

  @tryCatch(orLog)
  async resetPassword(email: string) {
    const result = await firebase.auth().sendPasswordResetEmail(email);
    console.log(result);
  }
}

export const auth = new AuthService();

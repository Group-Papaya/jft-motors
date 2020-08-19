import { tryCatch } from "@/utils";
import * as firebase from "firebase/app";
import { Logger } from "./../utils";

export default class AuthService {
  user!: firebase.User | null;

  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user;
    });
  }

  isAuthenticated() {
    return this.user && !this.user.isAnonymous;
  }

  @tryCatch(Logger)
  async register(email: string, password: string) {
    return await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        Logger(result);
      });
  }

  @tryCatch(Logger)
  async login(email: string, password: string) {
    return await firebase.auth().signInWithEmailAndPassword(email, password);
  }

  @tryCatch(Logger)
  async logout() {
    await firebase.auth().signOut();
  }

  @tryCatch(Logger)
  async resetPassword(email: string) {
    const result = await firebase.auth().sendPasswordResetEmail(email);
    Logger(result);
  }
}

export const auth = new AuthService();

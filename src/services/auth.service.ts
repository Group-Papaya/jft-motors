import { app } from "@/firebase";
import store from "@/store";
import { Logger, tryCatch } from "@/utils";
import * as firebase from "firebase/app";
import { dbService } from "./firestore.service";

export default class AuthService {
  user!: firebase.User | null;
  firebaseAuth!: firebase.auth.Auth;

  constructor(app: firebase.app.App) {
    this.firebaseAuth = app.auth();
    this.user = app.auth().currentUser;
  }

  @tryCatch(Logger)
  async register(email: string, password: string) {
    return await this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        dbService.add(
          { id: result.user?.uid, email, password },
          "users",
          result.user?.uid
        );
        Logger(result);
      });
  }

  @tryCatch(Logger)
  async login(email: string, password: string) {
    return await this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(credentials => {
        store.commit("SET_AUTH_STATE", {
          user: credentials.user,
          authenticated: true
        });
      });
  }

  @tryCatch(Logger)
  async logout() {
    await this.firebaseAuth.signOut().then(() => {
      store.commit("SET_AUTH_STATE", {
        user: null,
        authenticated: null
      });
    });
  }

  @tryCatch(Logger)
  async resetPassword(email: string) {
    const result = await this.firebaseAuth.sendPasswordResetEmail(email);
    Logger(result);
  }
}

export const auth = new AuthService(app);

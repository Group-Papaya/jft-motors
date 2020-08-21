import { app } from "@/firebase";
import store from "@/store";
import { Logger, tryCatch } from "@/utils";
import * as firebase from "firebase/app";
import { dbService } from "./firestore.service";

interface AuthResponse {
  error?: any;
  result?: any;
}

export default class AuthService {
  user!: firebase.User | null;
  firebaseAuth!: firebase.auth.Auth;

  constructor(app: firebase.app.App) {
    this.firebaseAuth = app.auth();
    this.user = app.auth().currentUser;
  }

  @tryCatch(Logger)
  async register(email: string, password: string): Promise<AuthResponse> {
    return await this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        dbService.add(
          { id: value.user?.uid, email, password },
          "users",
          value.user?.uid
        );
        return { result: value };
      })
      .catch(reason => {
        return { error: reason.message };
      });
  }

  @tryCatch(Logger)
  async login(email: string, password: string): Promise<AuthResponse> {
    return await this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(credentials => {
        store.commit("SET_AUTH_STATE", {
          user: credentials.user,
          authenticated: true
        });
        return { result: credentials };
      })
      .catch(reason => {
        return { error: reason };
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
  async resetPassword(email: string): Promise<AuthResponse> {
    return await this.firebaseAuth
      .sendPasswordResetEmail(email)
      .then(() => {
        return { result: "Password reset email sent" };
      })
      .catch(reason => {
        return { error: "Email required" };
      });
  }
}

export const auth = new AuthService(app);

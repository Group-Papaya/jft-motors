import { app } from "@/firebase";
import { User } from "@/models";
import store from "@/store";
import { Logger, tryCatch } from "@/utils";
import bcrypt from "bcryptjs";
import firebase from "firebase/app";
import { curd } from "./curd.service";
import { dbService } from "./firestore.service";
import { BASE_ROLE } from "@/models/User";

interface AuthResponse {
  error?: any;
  result?: any;
}

export default class AuthService {
  user!: firebase.User | null;
  auth!: firebase.auth.Auth;

  constructor(app: firebase.app.App) {
    this.auth = app.auth();
    this.user = app.auth().currentUser;
  }

  @tryCatch(Logger)
  async register({ email, password, ...rest }: User): Promise<AuthResponse> {
    if (store.getters.getUser(email) === undefined) {
      return await this.auth
        .createUserWithEmailAndPassword(email, password)
        .then(async credentials => {
          const { user } = credentials;
          if (user) {
            bcrypt.hash(password, 2).then(hash => {
              const newUser: User = {
                ...rest,
                id: user.uid,
                email: email,
                password: hash,
                role: rest.role ? rest.role : BASE_ROLE
              };
              dbService.add(newUser, "users", user.uid);
            });
            return { result: credentials };
          }
          return { error: "Failed to get the user registered" };
        })
        .catch(reason => {
          return { error: reason.message };
        });
    }
    return { error: `Email: ${email}, already in use` };
  }

  @tryCatch(Logger)
  async login(email: string, password: string): Promise<AuthResponse> {
    return await this.auth
      .signInWithEmailAndPassword(email, password)
      .then(async credentials => {
        store.commit("SET_AUTH_STATE", {
          user: await curd.get("users", credentials.user?.uid),
          authenticated: true
        });
        return { result: credentials };
      })
      .catch(reason => {
        return { error: reason };
      });
  }

  @tryCatch(Logger)
  async socialLogin(
    callback: (credentials: firebase.auth.UserCredential) => void
  ): Promise<AuthResponse> {
    return this.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(async credential => {
        if (credential.user) callback(credential);
        return { result: credential };
      })
      .catch(reason => ({ error: reason }));
  }

  @tryCatch(Logger)
  async logout() {
    await this.auth.signOut().then(() => {
      store.commit("SET_AUTH_STATE", {
        user: null,
        authenticated: null
      });
    });
  }

  @tryCatch(Logger)
  async resetPassword(email: string): Promise<AuthResponse> {
    return await this.auth
      .sendPasswordResetEmail(email)
      .then(() => {
        return { result: "Password reset email sent" };
      })
      .catch(reason => {
        return {
          error: {
            message: `Email required`,
            value: `[error: ${reason.message}]`
          }
        };
      });
  }
}

export const auth = new AuthService(app);

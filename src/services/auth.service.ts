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
  firebaseAuth!: firebase.auth.Auth;

  constructor(app: firebase.app.App) {
    this.firebaseAuth = app.auth();
    this.user = app.auth().currentUser;
  }

  @tryCatch(Logger)
  async register({ email, password, ...rest }: User): Promise<AuthResponse> {
    return await this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        bcrypt.hash(password, 2).then(hash => {
          const user = { id: value.user?.uid, email, password: hash, ...rest };
          dbService.add(user, "users", value.user?.uid);
        });
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
    userRole?: string,
    onCreation?: (details: any) => void
  ): Promise<AuthResponse> {
    return this.firebaseAuth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(async ({ user, additionalUserInfo: info, ...credentials }) => {
        if (store.getters.getUser(user?.email) === undefined) {
          if (onCreation === undefined) {
            bcrypt.hash("P@assword1", 2).then(hash => {
              const {
                given_name: firstname,
                family_name: lastname
              } = info?.profile as any;
              const newUser: User = {
                id: user?.uid,
                password: hash,
                role: userRole ? userRole : BASE_ROLE,
                lastname: lastname,
                firstname: firstname,
                email: user?.email as string,
                meta: {
                  isGoogleAccount: true
                }
              };
              dbService.add(newUser, "users", user?.uid);
            });
          } else onCreation({ user, info, ...credentials });
        }

        store.commit("SET_AUTH_STATE", {
          user: await curd.get("users", user?.uid),
          authenticated: true
        });
        return { result: { user, info, ...credentials } };
      })
      .catch(reason => ({ error: reason }));
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

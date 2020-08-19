import { app } from "@/firebase";
import { Logger, tryCatch } from "@/utils";
import * as firebase from "firebase/app";
import { dbService } from "./firestore.service";

export default class AuthService {
  user!: firebase.User | null;
  private auth!: firebase.auth.Auth;

  constructor(app: firebase.app.App) {
    this.auth = app.auth();
    this.auth.onAuthStateChanged(user => {
      this.user = user;
    });
  }

  isAuthenticated() {
    return this.user && !this.user.isAnonymous;
  }

  @tryCatch(Logger)
  async register(email: string, password: string) {
    return await this.auth
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
    return await this.auth.signInWithEmailAndPassword(email, password);
  }

  @tryCatch(Logger)
  async logout() {
    await this.auth.signOut();
  }

  @tryCatch(Logger)
  async resetPassword(email: string) {
    const result = await this.auth.sendPasswordResetEmail(email);
    Logger(result);
  }
}

export const auth = new AuthService(app);

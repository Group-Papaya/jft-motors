import { orLog } from "./../utils";
import * as firebase from "firebase/app";
import { tryCatch } from "@/utils";

export default class AuthService {
  auth!: firebase.auth.Auth;
  // provider!: firebase.auth.AuthProvider;

  constructor() {
    this.auth = firebase.auth();
    // this.provider = new firebase.auth.EmailAuthProvider()
  }

  @tryCatch(orLog)
  async register(email: string, password: string) {
    // return new Promise(async(resolve, reject) => {
    //   let result = await firebase
    //   .auth()
    //   .createUserWithEmailAndPassword(email, password);

    //   resolve(result)
    // })
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

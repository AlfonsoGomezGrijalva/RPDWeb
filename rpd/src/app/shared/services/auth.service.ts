import { Injectable, NgZone } from '@angular/core';
import { User } from "../services/user";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data
  token:string;
  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Sa
    ving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('rpdWeb', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('rpdWeb'));
      } else {
        localStorage.setItem('rpdWeb', null);
        JSON.parse(localStorage.getItem('rpdWeb'));
      }
    })
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.router.navigate(['home']);
        this.router.navigateByUrl('/home');
        this.ngZone.run(() => {
          result.user.getIdToken().then(st=>{
            console.log(st);
            this.token = st;
          });
        });
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  get isLoggedInAfterSignIn(): Observable<boolean>{ 
    return of(this.token !== null);
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('rpdWeb'));
    return user !== null && this.token !== null;
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    console.log(userRef);
    const userData: User = {
      uid: user.uid,
      email: user.email
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign out
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('rpdWeb');
      this.router.navigate(['sign-in']);
    })
  }

}

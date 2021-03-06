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
          this.afAuth.auth.currentUser.getIdToken().then(st=>{
            localStorage.setItem('rpdAuthToken', JSON.stringify(st));
          });
        });
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  get getCurrentToken(): string{
    return JSON.parse(localStorage.getItem('rpdWeb')).stsTokenManager.accessToken;
  }
  get isLoggedInAfterSignIn(): Observable<boolean>{ 
    const rpdToken = JSON.parse(localStorage.getItem('rpdAuthToken'));
    let isLogged = false;
    // console.log(rpdToken);
    if(rpdToken !== null){
      isLogged = true;
      localStorage.removeItem('rpdAuthToken');
    }
    return of(isLogged);
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('rpdWeb'));
    return user !== null && this.getCurrentToken !== null;
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
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

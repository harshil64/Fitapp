import { Injectable } from '@angular/core';
import { User } from './user.model';
import { AuthData } from './auth-data';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { TrainingService } from '../training/training.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { UiService } from '../shared/ui.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User;
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router, private afAuth: AngularFireAuth, private trainingService: TrainingService,private uiService: UiService) { }

  initAuthListener(){
    this.afAuth.authState.subscribe(user => {
      if(user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      }
      else{
        this.trainingService.cancelSubscription();
        this.user = null;
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    })
  }

  registerUser(authData: AuthData){ //if error put .auth after afauth
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.createUserWithEmailAndPassword(authData.email,authData.password).then(result => {
      this.uiService.loadingStateChanged.next(false);
      // console.log(result);
      // this.authSuccessfully(); //if sidenav navigation doesnt work remove this method and use authchange from below 
    })
    .catch( error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar(error.message, null, 3000);
    })
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random()*10000).toString()
    // };
    // this.authChange.next(true);
    // // this.authSuccessfully();
    // this.router.navigate(['/training']);

  }
  login(authData: AuthData){
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.signInWithEmailAndPassword(authData.email, authData.password)
    .then(result => {
      
      this.uiService.loadingStateChanged.next(false);
      // console.log(result);
      // this.authSuccessfully(); //if sidenav navigation doesnt work remove this method and use authchange from below 
    })
    .catch( error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar(error.message, null, 4000);     
    })
    // this.authChange.next(true);
    // this.router.navigate(['/training']);
 
    // this.authSuccessfully();
  }
  logout(){
    this.afAuth.signOut();

  }

  isAuth(){
    return this.isAuthenticated;
  }
}

import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService]
})
export class AppComponent {
  title = 'angular-material-tutorial';
  constructor(public auth: AuthService) {
    
  }

  userCheck(): boolean {
    return this.auth.isLoggedIn;
  }

  logout(){
     this.auth.SignOut();
  }
}

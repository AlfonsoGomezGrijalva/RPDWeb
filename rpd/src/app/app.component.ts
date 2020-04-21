import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { ApiService } from './data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService]
})
export class AppComponent {
  title = 'angular-material-tutorial';
  apiService: ApiService | null;
  constructor(public auth: AuthService, private _httpClient: HttpClient) {
    
  }

  userCheck(): boolean {
    return this.auth.isLoggedIn;
  }

  async logout(){
    let self = this;
    self.apiService = new ApiService(self._httpClient, self.auth);
    //delete token
    await self.apiService!.signOut().subscribe();
    
    //delete local storage
    self.auth.SignOut();
  }
}

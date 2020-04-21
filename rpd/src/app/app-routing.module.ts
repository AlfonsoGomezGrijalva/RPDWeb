import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { RpdTableComponent } from './rpd-table/rpd-table.component';
import { AddNewRpdComponent } from './add-new-rpd/add-new-rpd.component'
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: WelcomeComponent, canActivate:[AuthGuard] },
  { path: 'sign-in', component: SignInComponent},
  { path: 'rpd/guardados', component: RpdTableComponent, canActivate: [AuthGuard]  },
  { path: 'rpd/nuevo', component: AddNewRpdComponent, canActivate: [AuthGuard]  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
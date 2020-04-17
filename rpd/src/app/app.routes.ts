import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { RpdTableComponent } from './rpd-table/rpd-table.component';
import { AddNewRpdComponent } from './add-new-rpd/add-new-rpd.component'

const routes: Routes = [
  {path: '', component: WelcomeComponent},
  {path: 'rpd/guardados', component: RpdTableComponent },
  {path: 'rpd/nuevo', component: AddNewRpdComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouters {}
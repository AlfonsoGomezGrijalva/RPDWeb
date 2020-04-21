import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WelcomeComponent } from './welcome/welcome.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RpdTableComponent, RpdModal, RespuestaModal, DeleteModal } from './rpd-table/rpd-table.component';
import { AddNewRpdComponent } from './add-new-rpd/add-new-rpd.component';
import { SignInComponent } from './sign-in/sign-in.component';
// Firebase services + enviorment module
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
// Auth service
import { AuthService } from "./shared/services/auth.service";

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    RpdTableComponent,
    RpdModal,
    RespuestaModal,
    DeleteModal,
    AddNewRpdComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  entryComponents: [RpdTableComponent ,RpdModal, RespuestaModal, DeleteModal],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

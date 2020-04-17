import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRouters } from './app.routes';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WelcomeComponent } from './welcome/welcome.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RpdTableComponent, RpdModal, RespuestaModal } from './rpd-table/rpd-table.component';
import { AddNewRpdComponent } from './add-new-rpd/add-new-rpd.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    RpdTableComponent,
    RpdModal,
    RespuestaModal,
    AddNewRpdComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule,
    AppRouters,
    FlexLayoutModule,
    HttpClientModule
  ],
  entryComponents: [RpdTableComponent ,RpdModal, RespuestaModal],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

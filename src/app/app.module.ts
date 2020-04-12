import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatSpinner,
  MatProgressSpinnerModule,
  MatInputModule,
  MatCheckboxModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HeaderComponent } from './header/header.component';
import { EditCvComponent } from './edit-cv/edit-cv.component';
import { CvComponent, AddSectionDialog } from './cv/cv.component';
import { LoginComponent } from './auth/login/login.component'
import { SignupComponent } from './auth/signup/signup.component'
import { AuthInterceptor } from './auth/auth-interceptor'
import { AppRoutingModule } from './app-routing.module';
import { MainPageComponent } from './templates/main-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    EditCvComponent,
    CvComponent,
    AddSectionDialog,
    LoginComponent,
    SignupComponent,
    MainPageComponent
  ],
  entryComponents: [
    AddSectionDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    HttpClientModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }

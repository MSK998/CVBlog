import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainPageComponent } from './templates/main-page.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { AboutComponent } from './about/about.component';
import {GreetingPageComponent} from './templates/greeting-page.component'

const routes: Routes = [
  { path: '', component: GreetingPageComponent},
  { path: 'service/login', component: LoginComponent },
  { path: 'service/signup', component: SignupComponent},
  { path: 'service/about', component: AboutComponent},
  { path: ':creator', component: MainPageComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {

}

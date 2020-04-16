import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  isLoading = false;

  constructor(public authService: AuthService, private router: Router) { }

  checkValid(uName: string): boolean {

    if (! /^[a-zA-Z0-9]+$/.test(uName)) {
      return false;
    } else {
      return true;
    }
  }

  onLogin(form: NgForm): void {
    if (this.checkValid(form.value.loginUsername)) {
      this.isLoading = true;

      this.authService.loginUser(form.value.loginUsername, form.value.loginPassword);
      if(!this.authService.getIsAuth()){
        this.isLoading = false;
        form.form.controls.loginUsername.setErrors({invalid: true});
      } else{
        // do something
        form.resetForm();
      }


    } else {
      // return a failure
      console.log('failed validation');
      form.form.controls.loginUsername.setErrors({invalid: true});
    }
  }
}

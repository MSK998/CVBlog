import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  isLoading = false;

  constructor(public authService: AuthService) {

  }

  checkValid(uName: string): boolean {

    if (! /^[a-zA-Z0-9]+$/.test(uName)) {
      return false;
    } else {
      return true;
    }
  }

  onSignup(form: NgForm): void {
    if (this.checkValid(form.value.signupUsername)) {
      // do something
      console.log('Successful validation');
      this.isLoading = true;
      this.authService.createUser(form.value.signupUsername, form.value.signupPassword);
      form.resetForm();
    } else {
      // return a failure
      console.log('failed validation');
      form.form.controls.loginUsername.setErrors({invalid: true});
    }
  }
}

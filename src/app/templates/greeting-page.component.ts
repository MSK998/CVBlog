import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  template: ` <div>
    <p>Welcome to CVBlog!<br />Please Sign up or Log in from the top right!</p>
  </div>`,
  styles: [`div { display: block;
    color: grey;
    text-align: center;}`]
})
export class GreetingPageComponent implements OnInit, OnDestroy {
  private authListenerSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authListenerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((isAuth) => {
        if (!isAuth) {
          this.router.navigate(["/service/login"]);
        }
      });
  }

  ngOnDestroy() {
    this.authListenerSubscription.unsubscribe();
  }
}

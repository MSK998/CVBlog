import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  template: `
    <app-cv></app-cv>
    <app-edit-cv></app-edit-cv>
  `,
})
export class MainPageComponent implements OnInit, OnDestroy {
  private authListenerSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authListenerSubscription = this.authService.getAuthStatusListener().subscribe( isAuth => {
      if (!isAuth) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {}
}

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

import { AuthData } from "./auth-data";
import { CvService } from "../services/cv.service";

import { environment } from "../../environments/environment";

const BACKEND_URL = environment.API_URL + "user/";

@Injectable({ providedIn: "root" })
export class AuthService {
  private userId: string;
  private username: string;
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private CvService: CvService
  ) {}

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getUsername() {
    return this.username;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(username: string, password: string) {
    const userData: AuthData = { username, password };

    this.http.post(BACKEND_URL + "signup", userData).subscribe((response) => {
      this.router.navigate(["/service/login"]);
    });
  }

  loginUser(username: string, password: string) {
    const userData: AuthData = { username, password };

    this.http
      .post<{ token: string; userId: string; username:string; expiresIn: number }>(
        BACKEND_URL + "login",
        userData
      )
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          const userId = response.userId;
          this.userId = response.userId;
          this.username = response.username;

          const expiresInDuration = response.expiresIn;

          this.setAuthTimer(response.expiresIn);

          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          const now = new Date();
          const expireDate = new Date(now.getTime() + expiresInDuration * 1000);

          this.saveAuthData(token, userId, expireDate, username);

          this.router.navigate(["/" + username]);
        } else {
          this.isAuthenticated = false;
        }
      });
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();

    if (!authInfo) {
      return;
    }

    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.userId = authInfo.userId;
      this.isAuthenticated = true;
      this.username = authInfo.username
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.username = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(["/service/login"]);
    this.clearAuthData();
    this.CvService.clearCVData();
    clearTimeout(this.tokenTimer);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    userId: string,
    expirationDate: Date,
    username: string
  ) {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("username", username);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiration");
    localStorage.removeItem("username");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const expirationDate = localStorage.getItem("expiration");
    const username = localStorage.getItem("username")

    if (!token && !expirationDate) {
      return;
    }

    return {
      // tslint:disable-next-line: object-literal-shorthand
      token: token,
      // tslint:disable-next-line: object-literal-shorthand
      userId: userId,
      expirationDate: new Date(expirationDate),
      username: username,
    };
  }
}

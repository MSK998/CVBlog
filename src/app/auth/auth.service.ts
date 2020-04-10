import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private encryptKey: string;
  private userId: string;
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getEK() {
    return this.encryptKey;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(username: string, password: string) {
    const userData: AuthData = { username, password };

    this.http
      .post('http://localhost:3000/api/user/signup', userData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/login']);
      });
  }

  loginUser(username: string, password: string) {
    const userData: AuthData = { username, password };

    this.encryptKey = CryptoJS.PBKDF2(password, username, {keySize: 128 / 32}).toString();

    this.http
      .post<{ token: string, userId: string, expiresIn: number }>(
        'http://localhost:3000/api/user/login',
        userData
      )
      .subscribe(response => {
        console.log(response);
        const token = response.token;
        this.token = token;
        if (token) {
          const userId = response.userId;
          this.userId = userId;

          const expiresInDuration = response.expiresIn;

          this.setAuthTimer(response.expiresIn);

          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          const now = new Date();
          const expireDate = new Date(now.getTime() + expiresInDuration * 1000);

          this.saveAuthData(token, userId, this.encryptKey, expireDate);

          this.router.navigate(['/']);
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
      this.encryptKey = authInfo.key;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, userId: string, key: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('key', key);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('key');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const key = localStorage.getItem('key');
    const expirationDate = localStorage.getItem('expiration');

    if (!token && !expirationDate) {
      return;
    }

    return {
      // tslint:disable-next-line: object-literal-shorthand
      token: token,
      // tslint:disable-next-line: object-literal-shorthand
      userId: userId,
      // tslint:disable-next-line: object-literal-shorthand
      key: key,
      expirationDate: new Date(expirationDate)

    };
  }
}

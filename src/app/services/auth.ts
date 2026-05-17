import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private refreshTimer: any;
  private router = inject(Router);

  currentUser = signal<any | null>(null);

  constructor() {
    const token = localStorage.getItem('token');
    if (token && token.length > 10) {
      this.getProfile().subscribe({
        next: (user) => {
          this.setSession(token, 3600);
        },
        error: () => this.logout()
      });
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/login`, credentials).pipe(
      tap((res: any) => {
        const token = res.data?.accessToken;
        const expiresIn = res.data?.expiresIn || 3600;

        if (token) {
          this.setSession(token, expiresIn);
          this.currentUser.set(res.data);
          console.log('Login Success & Timer Started');
        }
      })
    );
  }
  getProfile() {
    return this.http.get(`${this.baseUrl}/api/users/me`).pipe(
      tap((user) => this.currentUser.set(user))
    );
  }
  updateProfile(userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/users/edit`, userData).pipe(
      tap((updatedUser: any) => {
        this.currentUser.set(updatedUser.data || updatedUser);
      })
    );
  }
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/register`, userData);
  }
  verifyEmail(email: string, code: string): Observable<any> {
    const payload = { email, code };
    return this.http.put(`${this.baseUrl}/api/auth/verify-email`, payload);
  }
  resendVerification(email: string): Observable<any> {
    if (!email) {
      console.error("Email is missing!");
      return throwError(() => new Error("Email is required"));
    }
    const url = `${this.baseUrl}/api/auth/resend-email-verification/${email}`;
    return this.http.post(url, {});
  }

  setSession(accessToken: string, expiresIn: number) {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);

    localStorage.setItem('token', accessToken);

    const timeout = 15 * 60 * 1000;
    
    this.refreshTimer = setTimeout(() => {
      this.refreshAccessToken();
    }, timeout);
  }

  refreshAccessToken() {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      this.navigateToLogin();
      return;
    }

    const url = `${this.baseUrl}/api/auth/refresh-access-token/${currentToken}`;

    this.http.post<any>(url, {}).subscribe({
      next: (res) => {
        console.log('HTTP Refresh Success!');
        const newToken = res.data?.accessToken || res.accessToken;
        const newExpires = res.data?.expiresIn || res.expiresIn || 3600;

        if (newToken) {
          this.setSession(newToken, newExpires);
        }
      },
      error: (err) => {
        console.error('Refresh Failed Redirecting to Login!', err);
        this.logout();
        this.navigateToLogin();
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
  }
  private navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
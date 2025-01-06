import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Change this when backend is ready
  private mockUser: User = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
  };

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        catchError(() => {
          // Mock response
          return of({
            token: 'mock-jwt-token',
            user: this.mockUser,
          });
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        catchError(() => {
          // Mock response
          return of({
            token: 'mock-jwt-token',
            user: this.mockUser,
          });
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

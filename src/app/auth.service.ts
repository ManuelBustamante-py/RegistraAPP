import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

export interface Usuario {
  id?: number;
  email: string;
  nombre: string;
  password: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost/mi_api/api.php';  // Asegúrate de que esta URL apunte a tu API
  private currentUserKey = 'currentUser';
  private tokenKey = 'auth_token';
  private userSubject = new BehaviorSubject<Usuario | null>(null);
  currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  private checkToken() {
    const token = localStorage.getItem(this.tokenKey);
    const user = localStorage.getItem(this.currentUserKey);
    if (token && user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  register(email: string, nombre: string, password: string, rol: string): Observable<any> {
    const usuario: Usuario = {
      email,
      nombre,
      password,
      rol
    };

    return this.http.post(`${this.apiUrl}?action=register`, usuario).pipe(
      tap((response: any) => {
        if (response.success) {
          this.setSession(response.user, response.token);
        }
      }),
      catchError(error => {
        console.error('Error en registro:', error);
        return throwError(() => error);
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}?action=login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.user) {
          this.setSession(response.user, response.token);
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  private setSession(user: Usuario, token: string) {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    localStorage.setItem(this.tokenKey, token);
    this.userSubject.next(user);
  }

  logout() {
    localStorage.removeItem(this.currentUserKey);
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  getUser(): Usuario | null {
    const userStr = localStorage.getItem(this.currentUserKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.rol : null;
  }

  cambiarPassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}?action=change-password`, {
      email,
      oldPassword,
      newPassword
    });
  }

  checkUserExistence(email: string): Observable<boolean> {
    return this.http.post(`${this.apiUrl}?action=check-email`, { email }).pipe(
      map((response: any) => {
        if (typeof response === 'string') {
          try {
            response = JSON.parse(response);
          } catch (e) {
            console.error('Error parsing response:', e);
            return false;
          }
        }
        
        if (response.hasOwnProperty('exists')) {
          return response.exists;
        } else {
          console.error('Unexpected response format:', response);
          return false;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 200) {
          console.error('Error in response format:', error);
          return of(false);
        }
        console.error('Error checking email:', error);
        return of(false);
      })
    );
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}?action=reset-password`, { email, newPassword }).pipe(
      catchError(error => {
        console.error('Error al restablecer la contraseña', error);
        return throwError(() => error);
      })
    );
  }
}
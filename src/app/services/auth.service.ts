import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuarios';
import { isNullOrUndefined } from 'util';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly URL_API = 'http://localhost:3000/api/auth/';
  usuario: Usuario;

  constructor(private http: HttpClient,
    private _router: Router) { }

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  isLoggedIn(): boolean {
    return this.usuario !== undefined;
  }

  login(userData): Observable<Usuario> {
    return this.http.post<Usuario>(this.URL_API + 'login',
    {email: userData.email, password: userData.password})
    .pipe(
      tap(usuario => this.usuario = usuario)
    );  
  }

  loginUser(user) {
    return this.http.post<any>(this.URL_API + 'login', user);
  }

  loggedIn() {
    return !!localStorage.getItem('accessToken');
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  logoutUser() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    return this.http.post<Usuario>(this.URL_API + 'logout', { headers: this.headers });
  }

  setUser(user: Usuario): void {
    const user_string = JSON.stringify(user);
    localStorage.setItem('currentUser', user_string);
  }

  setToken(token): void {
    localStorage.setItem('accessToken', token);
  }

  getCurrentUser(): Usuario {
    const user_string = localStorage.getItem('currentUser');
    if (!isNullOrUndefined(user_string)) {
      const user: Usuario = JSON.parse(user_string);
      return user;
    } else {
      return null;
    }
  }
}
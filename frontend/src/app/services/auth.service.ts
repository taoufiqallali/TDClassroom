import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

interface AuthResponse {
  username: string;
  authenticated: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password });
  }

  handleSuccessfulLogin(response: AuthResponse) {
    localStorage.setItem('currentUser', JSON.stringify(response));
    console.log('currentUser', JSON.stringify(response));
<<<<<<< HEAD
    this.router.navigate(['/user-list']);
=======
    this.router.navigate(['/hud']);
>>>>>>> 14b4b1e (added the the operations of reservation and equipement for the second time)
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
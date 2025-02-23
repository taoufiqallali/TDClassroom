import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

interface AuthResponse {
  username: string;
  authenticated: boolean;
  message: string;
  role: string;
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
    // Save the user data to localStorage
    localStorage.setItem('currentUser', JSON.stringify(response));
    console.log('currentUser', JSON.stringify(response));
  
    // Check the user's role and redirect accordingly
    if (response.role === 'ROLE_ADMIN') {
      this.router.navigate(['/admin-dash/dashboard']); // Redirect to admin dashboard
    } else {
      this.router.navigate(['/user-dash']); // Redirect to user dashboard
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}

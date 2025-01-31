import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.login(this.loginData.username, this.loginData.password)
      .subscribe({
        next: (response) => {
          if (response.authenticated) {
            this.authService.handleSuccessfulLogin(response);
          } else {
            this.error = response.message;
          }
        },
        error: (error) => {
          this.error = error.error.message || 'An error occurred during login';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}

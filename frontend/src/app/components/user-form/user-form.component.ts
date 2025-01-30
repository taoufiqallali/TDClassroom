import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  grade: string;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @Input() userId?: String;

  user: User = {
    nom: '',
    prenom: '',
    email: '',
    tel: '',
    grade: ''
  };

  isEditMode = false;
  submitted = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.userId) {
      this.isEditMode = true;
      this.loadUser();
    }
  }

  loadUser() {
   
    this.http.get<User>(`http://localhost:8080/api/personnes/email/${this.userId}`)
      .subscribe({
        next: (data) => {
          this.user = data;
        },
        error: (error) => {
          console.error('Error loading user:', error);
          this.errorMessage = 'Failed to load user data';
        }
      });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  private createUser() {
    this.http.post<User>('http://localhost:8080/api/personnes', this.user)
      .subscribe({
        next: (response) => {
          console.log('User created successfully');
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.errorMessage = 'Failed to create user';
        }
      });
  }

  private updateUser() {
    this.http.put<User>(`http://localhost:8080/api/users/${this.userId}`, this.user)
      .subscribe({
        next: (response) => {
          console.log('User updated successfully');
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.errorMessage = 'Failed to update user';
        }
      });
  }

  resetForm() {
    this.user = {
      nom: '',
      prenom: '',
      email: '',
      tel: '',
      grade: ''
    };
    this.submitted = false;
  }

  // Available grades for dropdown
  grades = ['Junior', 'Senior', 'Manager', 'Director'];
}
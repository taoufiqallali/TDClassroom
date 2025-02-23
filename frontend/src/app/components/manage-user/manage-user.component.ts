import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserService, User_list } from '../../services/user_list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserCreateService } from '../../services/user_create.service';

interface User {
  personneId: number;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  grade: string;
}

@Component({
  selector: 'app-manage-user',
  imports: [CommonModule, HttpClientModule, UserFormComponent, FormsModule],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css'
})
export class ManageUserComponent implements OnInit {
  users: User_list[] = [];
  searchQuery: string = '';
  groupedData: User_list[] = [];
  selected_email = '';
  currentTab = 1;
  isVisible: boolean = false;
  operation_type = 0;

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private userCreateService: UserCreateService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  closeItem() {
    this.operation_type = 0;
    this.selected_email = '';
    this.isVisible = false;
    this.loadUsers();
  }

  add_user(): void {
    this.selected_email = '';
    this.operation_type = 0;
    this.isVisible = !this.isVisible;
    this.loadUsers();
  }

  editUser(user: any) {
    this.selected_email = user.email;
    this.operation_type = 1;
    this.isVisible = !this.isVisible;
    this.loadUsers();
  }

  confirmDeleteUser(user: any) {
    const snackBarRef = this.snackBar.open('Are you sure you want to delete this user?', 'Yes', {
      duration: 5000,
      panelClass: ['centered-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    snackBarRef.onAction().subscribe(() => {
      this.deleteUser(user);
    });

    snackBarRef.afterDismissed().subscribe(() => {
      console.log('User deletion prompt dismissed');
    });
  }

  deleteUser(user: any) {
    this.userCreateService.deleteUser(user.personneId).subscribe(
      (response) => {
        console.log('User deleted:', response);
        this.simple_notification(`user deleted! ✅`);
        this.loadUsers();
      },
      (error) => {
        console.error('Error deleting user:', error);
        this.simple_notification(`error deleting user ❌`);
        this.loadUsers();
      }
    );
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
        this.filterUsers(); // Apply initial filtering
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  simple_notification(Message: string) {
    this.snackBar.open(Message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  filterUsers(): void {
    if (!this.searchQuery) {
      this.groupedData = this.users;
    } else {
      const searchTerm = this.searchQuery.toLowerCase();
      this.groupedData = this.users.filter(user => 
        user.nom.toLowerCase().includes(searchTerm) ||
        user.prenom.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }
  }

  onSearchChange(): void {
    this.filterUsers();
  }
}
import { Component,OnInit } from '@angular/core';
import { AdminHUDComponent } from '../admin-hud/admin-hud.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserService, User_list } from '../../services/user_list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserCreateService } from '../../services/user_create.service';

interface User {
  personneId:number;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  grade: string;
}


@Component({

  selector: 'app-manage-user',
  imports: [AdminHUDComponent,CommonModule,HttpClientModule,UserFormComponent],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css'
})
export class ManageUserComponent {

  users: User_list[] = [];
  constructor(private userService: UserService,private http: HttpClient,private snackBar: MatSnackBar,private userCreateService: UserCreateService) {}






  ngOnInit(): void {
    this.loadUsers();
  }

  selected_email='';
  currentTab = 1;
  isVisible: boolean = false; // Initially hidden
  operation_type=0; // this should = 2312 for user id to edit or 0 to create new user
    // Method for the second button (Button 2)
    
    closeItem() {
      this.operation_type=0;
      this.selected_email='';
      this.isVisible = false; // Hide when clicking outside
      this.loadUsers();
    }
    
    add_user(): void {
      this.selected_email='';
      this.operation_type=0;
      this.isVisible = !this.isVisible; // Toggle visibility
      this.loadUsers();
    }
  

    editUser(user: any) {
      this.selected_email=user.email;
      this.operation_type= 1;
      this.isVisible = !this.isVisible; // Toggle visibility
      this.loadUsers();
    }
  
    confirmDeleteUser(user: any) {
      const snackBarRef = this.snackBar.open('Are you sure you want to delete this user?', 'Yes', {
        duration: 5000, // The prompt will disappear after 5 seconds if no action
        panelClass: ['centered-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
  
      // Listen for the 'Yes' action to delete the user
      snackBarRef.onAction().subscribe(() => {
        this.deleteUser(user);
      });
  
      // Optionally, listen for the snack-bar closing automatically (i.e., 'No' or after timeout)
      snackBarRef.afterDismissed().subscribe(() => {
        console.log('User deletion prompt dismissed');
      });
    }
    //Method to delete user
    deleteUser(user: any) {

  
      this.userCreateService.deleteUser(user.personneId).subscribe(
        (response) => {
          // Success: User deleted
          console.log('User deleted:', response);
          this.simple_notification(`user deleted! ✅`);
          this.loadUsers();
        },
        (error) => {
          // Error: Handle failure
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
        },
        (error) => {
          console.error('Error fetching users', error);
        }
      );
    }
  
    simple_notification(Message:string){          
      this.snackBar.open(Message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });}

}


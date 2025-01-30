import { Component,OnInit } from '@angular/core';
import { AdminHUDComponent } from '../admin-hud/admin-hud.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserService, User_list } from '../../services/user_list.service';

interface User {
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
  constructor(private userService: UserService,private http: HttpClient) {}

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
    }
    
    add_user(): void {
      this.selected_email='';
      this.operation_type=0;
      this.isVisible = !this.isVisible; // Toggle visibility
    }
  

    editUser(user: any) {
      this.selected_email=user.email;
      this.operation_type= 1;
      this.isVisible = !this.isVisible; // Toggle visibility
    }
  
    // Method to delete user
    deleteUser(user: any) {
      console.log('Delete user:', user);
      // Add your delete functionality here
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
  

}


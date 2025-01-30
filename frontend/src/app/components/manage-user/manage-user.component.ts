import { Component,OnInit } from '@angular/core';
import { AdminHUDComponent } from '../admin-hud/admin-hud.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserFormComponent } from '../user-form/user-form.component';

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
  currentTab = 1;
  isVisible: boolean = false; // Initially hidden
  operation_type=0; // this should = 2312 for user id to edit or 0 to create new user
    // Method for the second button (Button 2)
    
    closeItem() {
      this.isVisible = false; // Hide when clicking outside
    }
    
    add_user(): void {
      this.operation_type=0;
      this.isVisible = !this.isVisible; // Toggle visibility
    }
  

    editUser(user: any) {
      this.operation_type= 22;
      this.isVisible = !this.isVisible; // Toggle visibility
    }
  
    // Method to delete user
    deleteUser(user: any) {
      console.log('Delete user:', user);
      // Add your delete functionality here
    }
    users: User[] = [
      { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com', tel: '0612345678', grade: 'Senior' },
      { nom: 'Martin', prenom: 'Marie', email: 'marie.martin@email.com', tel: '0623456789', grade: 'Junior' },
      { nom: 'Bernard', prenom: 'Paul', email: 'paul.bernard@email.com', tel: '0634567890', grade: 'Manager' },
      { nom: 'Thomas', prenom: 'Sophie', email: 'sophie.thomas@email.com', tel: '0645678901', grade: 'Senior' },
      { nom: 'Thomas', prenom: 'Sophie', email: 'sophie.thomas@email.com', tel: '0645678901', grade: 'Senior' },
      { nom: 'Bernard', prenom: 'Paul', email: 'paul.bernard@email.com', tel: '0634567890', grade: 'Manager' },
      { nom: 'Thomas', prenom: 'Sophie', email: 'sophie.thomas@email.com', tel: '0645678901', grade: 'Senior' },
      { nom: 'Thomas', prenom: 'Sophie', email: 'sophie.thomas@email.com', tel: '0645678901', grade: 'Senior' },
      { nom: 'Bernard', prenom: 'Paul', email: 'paul.bernard@email.com', tel: '0634567890', grade: 'Manager' },
      { nom: 'Thomas', prenom: 'Sophia', email: 'sophie.thomas@email.com', tel: '0645678901', grade: 'Senior' },

    ];
  
    constructor(private http: HttpClient) {}
}


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-dash',
  templateUrl: './user-dash.component.html',
  styleUrl: './user-dash.component.css',
  standalone: true,
  imports: [CommonModule, HeaderComponent, AdminSidebarComponent, RouterModule] // Add CommonModule
  
})
export class UserDashComponent {

}

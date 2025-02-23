import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-user-dash',
  templateUrl: './user-dash.component.html',
  styleUrl: './user-dash.component.css',
  standalone: true,
  imports: [CommonModule, HeaderComponent, UserSidebarComponent, RouterModule] // Add CommonModule
  
})
export class UserDashComponent {

}

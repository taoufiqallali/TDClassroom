import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngClass
import { HeaderComponent } from './../header/header.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dash',
  templateUrl: './admin-dash.component.html',
  standalone: true,
  imports: [CommonModule, HeaderComponent, AdminSidebarComponent, RouterModule] // Add CommonModule
})
export class AdminDashComponent {
  // Add missing properties
  sidebarCollapsed = false;
  isMobile = false;

  constructor() {
    this.checkScreenSize(); // Check screen size on initialization
  }

  // Listen for window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  // Method to check screen size
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // Adjust breakpoint as needed
  }
}
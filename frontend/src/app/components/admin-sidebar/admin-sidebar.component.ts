import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AdminSidebarComponent implements OnInit {
  // Tracks the collapsed state of the sidebar
  collapsed = false;

  // Tracks the active tab
  activeTab: string = '';

  // Tracks whether the screen is mobile
  isMobileScreen = false;

  // Array of navigation items with their corresponding icons
  navItems = [
    { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Classrooms', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { name: 'Equipment', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
    { name: 'Reservations', icon: 'M8 7V3m8 4V3m-9 8h10m-10 4h6m-9 8h18a2 2 0 002-2V5a2 2 0 00-2-2H3a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ];

  constructor(private router: Router) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    // Set initial active tab based on current route
    this.setActiveTabFromCurrentRoute();

    // Subscribe to router events to update the active tab on navigation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTabFromCurrentRoute();
      }
    });
  }

  // Toggles the sidebar's collapsed state
  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  // Navigates to the specified route
  navigateTo(route: string) {
    this.router.navigate([`/admin-dash/${route.toLowerCase()}`]);
  }

  // Checks if the screen is mobile
  isMobile(): boolean {
    return this.isMobileScreen;
  }

  // Listens for window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  // Updates the mobile screen state
  private checkScreenSize() {
    this.isMobileScreen = window.innerWidth < 768; // 768px is the breakpoint for mobile
    if (this.isMobileScreen) {
      this.collapsed = true; // Collapse sidebar by default on mobile
    }
  }

  // Sets the active tab based on the current route
  private setActiveTabFromCurrentRoute(): void {
    const currentUrl = this.router.url.toLowerCase(); // Convert to lowercase for case-insensitive comparison
    this.navItems.forEach(item => {
      // Check if the current URL includes the nav item's name
      if (currentUrl.includes(item.name.toLowerCase())) {
        this.activeTab = item.name;
      }
    });
  }
}
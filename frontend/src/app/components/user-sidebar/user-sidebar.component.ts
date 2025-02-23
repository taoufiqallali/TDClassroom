import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class UserSidebarComponent implements OnInit {
  collapsed = false;
  activeTab: string = '';
  isMobileScreen = false;

  navItems = [
    { name: 'Dashboard', path: 'dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Reservations', path: 'my-reservations', icon: 'M8 7V3m8 4V3m-9 8h10m-10 4h6m-9 8h18a2 2 0 002-2V5a2 2 0 00-2 2H3a2 2 0 00-2 2v14a2 2 0 002 2z' },
  ];

  constructor(private router: Router) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.setActiveTabFromCurrentRoute();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTabFromCurrentRoute();
      }
    });
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  navigateTo(route: string) {
    this.router.navigate([`/user-dash/${route.toLowerCase()}`]);
  }

  isMobile(): boolean {
    return this.isMobileScreen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobileScreen = window.innerWidth < 768;
    if (this.isMobileScreen) {
      this.collapsed = true;
    }
  }

  private setActiveTabFromCurrentRoute(): void {
    const currentUrl = this.router.url.toLowerCase();
    this.activeTab = this.navItems.find(item => currentUrl.includes(item.path.toLowerCase()))?.name || '';
  }
}

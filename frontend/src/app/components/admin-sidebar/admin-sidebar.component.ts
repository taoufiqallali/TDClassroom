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

  // Propriétés de suivi de l'état de la barre latérale
  collapsed = false; // Indique si la barre latérale est réduite ou non
  activeTab: string = ''; // Indique l'onglet actif
  isMobileScreen = false; // Indique si l'écran est de type mobile

  // Tableau des éléments de navigation avec leurs icônes correspondantes
  navItems = [
    { name: 'Dashboard', path: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Users', path: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Classrooms', path: 'Classrooms', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { name: 'Pending Reservations', path: 'Reservations', icon: 'M8 7V3m8 4V3m-9 8h10m-10 4h6m-9 8h18a2 2 0 002-2V5a2 2 0 00-2 2H3a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { name: 'Confirmed Reservations', path: 'fixedres', icon: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },

  ];

  constructor(private router: Router) {
    this.checkScreenSize(); // Vérifie la taille de l'écran lors de l'initialisation
  }

  ngOnInit(): void {
    this.setActiveTabFromCurrentRoute(); // Définit l'onglet actif initialement basé sur l'URL actuelle
    this.router.events.subscribe((event) => { // S'abonne aux événements du routeur pour mettre à jour l'onglet actif lors de la navigation

      if (event instanceof NavigationEnd) {
        this.setActiveTabFromCurrentRoute();
      }
    });
  }


  // Méthode pour basculer l'état réduit de la barre latérale

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }


  // Méthode pour naviguer vers l'itinéraire spécifié

  navigateTo(route: string) {
    this.router.navigate([`/admin-dash/${route.toLowerCase()}`]);
  }


  // Méthode pour vérifier si l'écran est de type mobile

  isMobile(): boolean {
    return this.isMobileScreen;
  }


  // Écoute les événements de redimensionnement de la fenêtre

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize(); // Met à jour l'état de l'écran mobile lors du redimensionnement
  }


  // Méthode privée pour mettre à jour l'état de l'écran mobile
  private checkScreenSize() {
    this.isMobileScreen = window.innerWidth < 768; // 768px est le point de rupture pour mobile
    if (this.isMobileScreen) {
      this.collapsed = true; // Réduit la barre latérale par défaut sur mobile
    }
  }

  // Méthode privée pour définir l'onglet actif basé sur l'URL actuelle
  private setActiveTabFromCurrentRoute(): void {
    const currentUrl = this.router.url.toLowerCase(); // Convertit l'URL en minuscules pour une comparaison insensible à la casse
    this.navItems.forEach(item => {
      if (currentUrl.includes(item.path.toLowerCase())) { // Vérifie si l'URL actuelle inclut le nom de l'élément de navigation
        this.activeTab = item.name;
      }
    });
  }
}

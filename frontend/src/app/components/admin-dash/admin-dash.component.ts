import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngClass
import { HeaderComponent } from './../header/header.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dash',
  standalone: true,
  imports: [CommonModule, HeaderComponent, AdminSidebarComponent, RouterModule], // Ajout de CommonModule
  templateUrl: './admin-dash.component.html'
})
export class AdminDashComponent {
  // Propriétés ajoutées
  sidebarCollapsed = false; // Indique si la barre latérale est réduite ou non
  isMobile = false; // Indique si l'écran est de type mobile ou non

  constructor() {
    this.checkScreenSize(); // Vérifie la taille de l'écran lors de l'initialisation du composant
  }

  // Écoute les événements de redimensionnement de la fenêtre
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize(); // Vérifie la taille de l'écran lors du redimensionnement
  }

  // Méthode pour vérifier la taille de l'écran
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // Définit isMobile à true si la largeur de la fenêtre est inférieure à 768 pixels, sinon à false
  }
}
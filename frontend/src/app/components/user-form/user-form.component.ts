import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserCreateService } from '../../services/user_create.service';

// Interface représentant un utilisateur
interface User {
  personneId: number;     // Correspond à `personneId` dans le backend
  nom: string;            // Correspond à `nom`
  prenom: string;         // Correspond à `prenom`
  dateNaissance: string;  // Correspond à `dateNaissance` (converti en string dans le frontend)
  email: string;          // Correspond à `email`
  cin: string;            // Correspond à `CIN`
  tel: string;            // Correspond à `tel`
  grade: string;          // Correspond à `grade` (enum dans le backend, string dans le frontend)
  address: string;        // Correspond à `address`
  ville: string;          // Correspond à `ville`
  codePostale: string;    // Correspond à `codePostale`
  responsabilite: string; // Correspond à `responsabilite` (enum dans le backend, string dans le frontend)
  nomBanque: string;      // Correspond à `nomBanque`
  som: string;            // Correspond à `som`
  motDePasse: string;     // Correspond à `motDePasse`
  uniteOrganisation: any; // Correspond à `uniteOrganisation` (peut être un objet ou un type simple)
  roles: any[];           // Correspond aux rôles dans la table `Personne_role`, un tableau de rôles
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  // Propriétés d'entrée et de sortie
  @Input() userId?: string; // ID de l'utilisateur pour le mode édition
  @Output() triggercloseItem = new EventEmitter<void>(); // Événement pour fermer le formulaire
  @Output() triggersimple_notification = new EventEmitter<string>(); // Événement pour afficher une notification

  // Propriétés du composant
  user: User = {
    personneId: 0,
    nom: '',
    prenom: '',
    dateNaissance: '',
    email: '',
    cin: '',
    tel: '',
    grade: '',
    address: '',
    ville: '',
    codePostale: '',
    responsabilite: '',
    nomBanque: '',
    som: '',
    motDePasse: '',
    uniteOrganisation: '',
    roles: [],
  };

  isEditMode = false; // Mode édition ou création
  submitted = false; // Indique si le formulaire a été soumis
  errorMessage = ''; // Message d'erreur en cas d'échec

  // Listes pour les menus déroulants
  grades = ['professeur', 'ingenieur', 'technicien'];
  responsabilites = ['administrateur', 'chef', 'adjoint', 'directeur'];

  constructor(private http: HttpClient, private userCreateService: UserCreateService) {}

  // Méthodes du cycle de vie Angular
  ngOnInit() {
    if (this.userId) {
      this.isEditMode = true; // Activer le mode édition si un ID est fourni
      this.loadUser(); // Charger les données de l'utilisateur
    }
  }

  // Méthodes pour gérer les événements
  self_close() {
    this.triggercloseItem.emit(); // Fermer le formulaire
  }

  simple_notification(message: string) {
    this.triggersimple_notification.emit(message); // Afficher une notification
  }

  // Méthodes pour charger et formater les données
  loadUser() {
    this.http.get<User>(`http://localhost:8080/api/personnes/email/${this.userId}`).subscribe({
      next: (data) => {
        this.user = {
          ...data,
          dateNaissance: this.formatDateForInput(data.dateNaissance), // Formater la date
          motDePasse: '', // Réinitialiser le mot de passe
        };
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        this.errorMessage = 'Échec du chargement des données de l\'utilisateur';
      },
    });
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return ''; // Gérer les dates vides
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extraire YYYY-MM-DD
  }

  // Méthodes pour gérer la soumission du formulaire
  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      this.updateUser(); // Mettre à jour l'utilisateur en mode édition
    } else {
      this.createUser(); // Créer un nouvel utilisateur en mode création
    }
  }

  private createUser() {
    this.userCreateService.createUser(this.user).subscribe({
      next: (message) => {
        console.log('Utilisateur créé avec succès:', message);
        this.simple_notification(`Utilisateur créé avec succès ! ✅`);
        this.self_close(); // Fermer le formulaire après la création
      },
      error: (err) => {
        console.error('Échec de la création de l\'utilisateur:', err);
        this.simple_notification(`❌ Erreur lors de la création de l'utilisateur. Veuillez réessayer.`);
      },
    });
  }

  private updateUser() {
    this.userCreateService.updateUser(this.user.personneId, this.user).subscribe({
      next: (message) => {
        console.log('Utilisateur mis à jour avec succès:', message);
        this.simple_notification(`Utilisateur mis à jour avec succès ! ✅`);
        this.self_close(); // Fermer le formulaire après la mise à jour
      },
      error: (err) => {
        console.error('Échec de la mise à jour de l\'utilisateur:', err);
        this.simple_notification(`❌ Erreur lors de la mise à jour de l'utilisateur. Veuillez réessayer.`);
      },
    });
  }

  // Méthodes pour réinitialiser le formulaire
  resetForm() {
    this.user = {
      personneId: 0,
      nom: '',
      prenom: '',
      dateNaissance: '',
      email: '',
      cin: '',
      tel: '',
      grade: '',
      address: '',
      ville: '',
      codePostale: '',
      responsabilite: '',
      nomBanque: '',
      som: '',
      motDePasse: '',
      uniteOrganisation: '',
      roles: [],
    };
    this.submitted = false;
  }
}
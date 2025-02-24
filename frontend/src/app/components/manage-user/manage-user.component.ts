import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserService, User_list } from '../../services/user_list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserCreateService } from '../../services/user_create.service';

interface User {
  personneId: number;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  grade: string;
  roles: string[];
}

@Component({
  selector: 'app-manage-user',

  imports: [CommonModule, HttpClientModule, UserFormComponent, FormsModule],

  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css'
})
export class ManageUserComponent implements OnInit {

  users: User_list[] = [];
  searchQuery: string = '';
  groupedData: User_list[] = [];
  selected_email = '';
  currentTab = 1;
  isVisible: boolean = false;
  operation_type = 0;

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private userCreateService: UserCreateService
  ) {}


  ngOnInit(): void {
    // Charge les utilisateurs lors de l'initialisation du composant
    this.loadUsers();
  }


  // Méthodes de gestion de l'interface utilisateur
  closeItem() {
    // Ferme le formulaire de création/édition et réinitialise les propriétés
    this.operation_type = 0;
    this.selected_email = '';
    this.isVisible = false;
    this.loadUsers();
  }

  add_user(): void {

    // Affiche le formulaire de création d'utilisateur

    this.selected_email = '';
    this.operation_type = 0;
    this.isVisible = !this.isVisible;
    this.loadUsers();
  }

  editUser(user: any) {

    // Affiche le formulaire d'édition pour l'utilisateur sélectionné

    this.selected_email = user.email;
    this.operation_type = 1;
    this.isVisible = !this.isVisible;
    this.loadUsers();
  }

  confirmDeleteUser(user: any) {

    // Affiche une confirmation de suppression de l'utilisateur
    const snackBarRef = this.snackBar.open('Êtes-vous sûr de vouloir supprimer cet utilisateur ?', 'Oui', {

      duration: 5000,
      panelClass: ['centered-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    snackBarRef.onAction().subscribe(() => {

      // Supprime l'utilisateur si l'action "Oui" est confirmée

      this.deleteUser(user);
    });

    snackBarRef.afterDismissed().subscribe(() => {

      // Logique optionnelle après la fermeture de la notification
      console.log('Invite de suppression d\'utilisateur ignorée');
    });
  }

  // Méthodes de gestion des données
  deleteUser(user: any) {
    // Supprime l'utilisateur via le service UserCreateService
    this.userCreateService.deleteUser(user.personneId).subscribe(
      (response) => {
        // Succès de la suppression
        console.log('Utilisateur supprimé:', response);
        this.simple_notification(`utilisateur supprimé! ✅`);
        this.loadUsers();
      },
      (error) => {
        // Erreur lors de la suppression
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        this.simple_notification(`erreur lors de la suppression de l'utilisateur ❌`);
        this.loadUsers();
      }
    );
  }

  loadUsers(): void {

    // Charge la liste des utilisateurs à partir du service UserService
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        // Filtre les utilisateurs pour exclure les administrateurs
        this.users = data.filter(u => !u.roles.includes('ADMIN'));
        this.groupedData = this.users;
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }


  // Méthode de notification simple
  simple_notification(Message: string) {
    // Affiche une notification avec le message donné
    this.snackBar.open(Message, 'Fermer', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }


  filterUsers(): void {
    if (!this.searchQuery) {
      this.groupedData = this.users;
    } else {
      const searchTerm = this.searchQuery.toLowerCase();
      this.groupedData = this.users.filter(user => 
        user.nom.toLowerCase().includes(searchTerm) ||
        user.prenom.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }
  }

  onSearchChange(): void {
    this.filterUsers();
  }

}